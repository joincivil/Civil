#!/bin/sh
echo "ENVIRONMENT is: $ENVIRONMENT"
envsubst '\$ENVIRONMENT' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html
exec nginx -g 'daemon off;'
