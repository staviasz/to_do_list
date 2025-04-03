FROM node:20-alpine
WORKDIR /app

RUN wget -O dockerize.tar.gz https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzf dockerize.tar.gz \
    && rm dockerize.tar.gz \
    && chmod +x /usr/local/bin/dockerize

RUN apk add --no-cache openssl


RUN npm install -g pnpm

COPY . .

ENTRYPOINT ["dockerize", "-wait", "tcp://postgres_educt:5432"]

CMD ["sh","-c", "chmod +x ./init-app.sh && ./init-app.sh"]
