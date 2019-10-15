FROM nginx:1.12-alpine
ADD ./packages/dapp/build /usr/share/nginx/html
ADD ./packages/dapp/devops/nginx.conf /etc/nginx/conf.d/default.conf
ADD ./packages/dapp/devops/start.sh /start.sh
RUN chmod u+x /start.sh
EXPOSE 3000
ENV ENVIRONMENT="{}"

CMD /start.sh