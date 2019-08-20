#!/bin/sh
echo "ENVIRONMENT: $ENVIRONMENT"
echo "GA_TRACKING_ID\: $GA_TRACKING_ID"
echo "PRERENDER_TOKEN\: $PRERENDER_TOKEN"
envsubst '\$ENVIRONMENT:\$GA_TRACKING_ID' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
envsubst '\$PRERENDER_TOKEN' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv  /usr/share/nginx/html/index.html.tmp  /usr/share/nginx/html/index.html
mv  /etc/nginx/conf.d/default.conf.tmp  /etc/nginx/conf.d/default.conf
cat /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
