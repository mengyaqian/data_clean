#! /bin/bash

if [[ -z "${DOCKER_REG}" ]]; then
  DOCKER_REG="repository.chinanorth.cloudapp.chinacloudapi.cn"
fi

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

IMAGE_NAME="cbb/acquisition_filter_ui"

TAG_NAME="test"

DOCKER_IMAGE="${DOCKER_REG}/${IMAGE_NAME}:${TAG_NAME}"
CNTNR_NAME="acquisition-filter-ui"

WEB_CID=`docker ps -a -f name=${CNTNR_NAME} -q`

if [ ! -z $WEB_CID ]; then
  docker rm -f $WEB_CID
fi

IMAGE_ID=`docker images ${DOCKER_IMAGE} -q`

if [[ ! -z ${IMAGE_ID} ]]; then
  docker rmi -f ${IMAGE_ID}
fi

echo ${DOCKER_PASSWORD} | docker login -u "${DOCKER_USERNAME}" --password-stdin ${DOCKER_REG}

docker run -itd --name ${CNTNR_NAME} -p 50099:80 $DOCKER_IMAGE
