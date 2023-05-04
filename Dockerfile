FROM node:18 as build

WORKDIR /app
COPY . .

ARG VITE_AWS_KEY
ARG VITE_AWS_SECRET
ARG VITE_AUTH_URL
ARG VITE_PROJECT_ID
ARG VITE_CARGO_ENDPOINT
ARG VITE_S3_ENDPOINT

ENV VITE_AWS_KEY ${VITE_AWS_KEY}
ENV VITE_AWS_SECRET ${VITE_AWS_SECRET}
ENV VITE_AUTH_URL ${VITE_AUTH_URL}
ENV VITE_PROJECT_ID ${VITE_PROJECT_ID}
ENV VITE_CARGO_ENDPOINT ${VITE_CARGO_ENDPOINT}
ENV VITE_S3_ENDPOINT ${VITE_S3_ENDPOINT}

RUN npm install
RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

COPY generate_env.sh /

CMD ["/bin/bash", "-c", "/generate_env.sh && nginx -g 'daemon off;'"]