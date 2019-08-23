# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:10.12.0-stretch as build
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install
COPY . .
RUN rm -f .npmrc

# Build Everything
RUN yarn build

FROM nginx:1.12-alpine
COPY --from=build /app/build /usr/share/nginx/html
ADD ./devops/nginx.conf /etc/nginx/conf.d/default.conf
ADD ./devops/start.sh /start.sh
RUN chmod u+x /start.sh
EXPOSE 3000
ENV ENVIRONMENT="{}"

CMD /start.sh