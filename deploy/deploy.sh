#!/bin/sh
OLDPWD=`pwd`

cd /app
cp nginx.conf /etc/nginx/nginx.conf

exec supervisord -c supervisord.conf

