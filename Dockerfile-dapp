# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:10.12.0-stretch as build
ARG version
WORKDIR /app

COPY . .
RUN yarn install

# Build Everything
RUN REACT_APP_APP_VERSION=$version yarn build

FROM nginx:1.12-alpine
COPY --from=build /app/packages/dapp/build /usr/share/nginx/html
ADD ./packages/dapp/devops/nginx.conf /etc/nginx/conf.d/default.conf
ADD ./packages/dapp/devops/start.sh /start.sh
RUN chmod u+x /start.sh
EXPOSE 3000
ENV ENVIRONMENT="{}"

CMD /start.sh