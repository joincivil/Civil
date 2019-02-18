#!/bin/sh

envsubst '\$ENVIRONMENT' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html && cat /usr/share/nginx/html/index.html && exec nginx -g 'daemon off;'
