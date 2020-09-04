FROM nginx:alpine

LABEL MAINTAINER="Jason Jiao <Jason.Jiao@Honeywell.com>"

ARG PACKAGE

ADD ./${PACKAGE} /usr/share/nginx/html/
