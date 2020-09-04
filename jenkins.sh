#! /bin/bash

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [[ -z "${DOCKER_REG}" ]]; then
    DOCKER_REG="repository.chinanorth.cloudapp.chinacloudapi.cn"
fi

IMAGE_NAME="cbb/acquisition_filter_ui"
TAG_NAME="latest"

CNPM_IMAGE="node-cnpm:10.18.0-alpine3.9"
DOCKER_IMAGE="${DOCKER_REG}/${IMAGE_NAME}:${BUILD_NUMBER}"
DOCKER_TEST_IMAGE="${DOCKER_REG}/${IMAGE_NAME}:test"
BASE_IMAGE="${DOCKER_REG}/${IMAGE_NAME}:base"

ARTIFACT="acquisition-filter-ui-build-${BUILD_NUMBER}.tar.gz"
ARTIFACT_SHA="acquisition-filter-ui-${BUILD_NUMBER}.tar.gz.sha256"

function build_cnpm() {
  IMAGE_ID=$(docker images ${CNPM_IMAGE} -q)

  if [[ -z ${IMAGE_ID} ]]; then
    docker build -f Dockerfile.cnpm --no-cache -t ${CNPM_IMAGE} .
    ret=$?
    if [[ 0 != "${ret}" ]]; then
      echo "Failed to build image ${CNPM_IMAGE}."
      exit ${ret}
    fi
  fi
}

function build_base_image() {
  IMAGE_ID=$(docker images ${BASE_IMAGE} -q)

  if [[ -z ${IMAGE_ID} ]]; then
    docker build --no-cache -f Dockerfile.base -t ${BASE_IMAGE} .
    ret=$?
    if [[ 0 != "${ret}" ]]; then
      echo "Failed to build image ${BASE_IMAGE}."
      exit ${ret}
    fi
  else
    CHANGE_LIST=$(git diff --name-only "${GIT_PREVIOUS_COMMIT}" "${GIT_COMMIT}")
    if [[ $CHANGE_LIST =~ package.json ]]; then
      docker rmi -f "${IMAGE_ID}"
      docker build --no-cache -f Dockerfile.base -t ${BASE_IMAGE} .
      ret=$?
      if [[ 0 != "${ret}" ]]; then
        echo "Failed to build image ${BASE_IMAGE}."
        exit ${ret}
      fi
    fi
  fi
}

function build_image() {
  # Build with PRODUCTION env configuration
  docker run --rm --volume "$BASEDIR:/app" ${BASE_IMAGE} /bin/sh -c "${SCRIPT}"
  ret=$?
  if [[ 0 != "${ret}" ]]; then
    echo "Failed to build with production configuration."
    exit ${ret}
  fi

  sha256sum "${ARTIFACT}" > "${ARTIFACT_SHA}"
  CHECKSUM=$(cut -c 1-64 < "$ARTIFACT_SHA")

  docker build . --no-cache -t $DOCKER_IMAGE --build-arg PACKAGE="${ARTIFACT}"
  ret=$?
  if [[ 0 != "${ret}" ]]; then
    echo "Failed to build image ${DOCKER_IMAGE}."
    exit ${ret}
  fi

  # docker login before push image
  echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin ${DOCKER_REG}
  docker push ${DOCKER_IMAGE}
  ret=$?
  if [[ 0 != "${ret}" ]]; then
    echo "Failed to push image ${DOCKER_IMAGE} to the Registry"
    exit ${ret}
  fi
}

function upload_artifacts() {
  curl -uipredict:"${IPREDICT_KEY}" -X PUT "http://10.0.0.7:10081/artifactory/ipredict/imal-ui/${BUILD_NUMBER}/${ARTIFACT}" -T "${ARTIFACT}"
  curl -uipredict:"${IPREDICT_KEY}" -H "X-Checksum-Deploy:true" -H "X-Checksum-Sha256:${CHECKSUM}" -X PUT "http://10.0.0.7:10081/artifactory/ipredict/imal-ui/${BUILD_NUMBER}/${ARTIFACT}"
}

function deploy() {
  ssh -i ~/.ssh/id_rsa H230809@10.0.0.4 "export DOCKER_USERNAME=${DOCKER_USERNAME} && export DOCKER_PASSWORD=${DOCKER_PASSWORD} && bash -s" < deploy.sh
}

function clean() {
  docker image prune -f
  docker rmi -f ${DOCKER_IMAGE}
  docker rmi -f ${DOCKER_TEST_IMAGE}
}

cd "${BASEDIR}" || exit 1

SCRIPT=$(cat <<EOF
cd /opt \
&& cp -R /app/*.js /app/public /app/src /app/package.json /app/.browserslistrc /app/tsconfig.json . \
&& cp /app/.env.production . \
&& cnpm run build \
&& mkdir -p hce/idas/acquisition_filter/portal \
&& mv dist/* hce/idas/acquisition_filter/portal \
&& tar zcf ${ARTIFACT} hce \
&& mv ${ARTIFACT} /app
EOF
)

build_cnpm

build_base_image

build_image

# Temporarily disable artifacts uploading
# upload_artifacts

clean

deploy
