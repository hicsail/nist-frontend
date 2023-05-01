FROM node:18 as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

COPY generate_env.sh /

CMD ["/bin/bash", "-c", "generate_env.sh && nginx -g 'daemon off;'"]