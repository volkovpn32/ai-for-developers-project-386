#!/bin/sh
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
java -jar /app/quarkus-app/quarkus-run.jar &
nginx -g 'daemon off;'