FROM node:19-alpine as builder
WORKDIR /app
COPY . .
RUN npx update-browserslist-db@latest
RUN npm install --development && npm run build


FROM nginx:1.23-alpine

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./certs /certs
COPY --from=builder /app/build /usr/share/nginx/html
