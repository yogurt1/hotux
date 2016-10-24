FROM alpine:latest
MAINTAINER stalinswag1@gmail.com

RUN apk update && apk add --no-cache nodejs nginx supervisord
RUN mkdir -p /app
#COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
ADD . /app
RUN /app/deploy.sh
#RUN cp /app/nginx.conf /etc/nginx/nginx.conf
#RUN cd /app && npm install && cp nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["supervisor"]
