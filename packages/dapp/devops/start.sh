#!/bin/sh
echo "ENVIRONMENT: $ENVIRONMENT"
echo "GA\: $GA_ID"
envsubst '\$ENVIRONMENT:\$GA_TRACKING_ID' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv  /usr/share/nginx/html/index.html.tmp  /usr/share/nginx/html/index.html
exec nginx -g 'daemon off;'
