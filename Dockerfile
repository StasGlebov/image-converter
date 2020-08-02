FROM node:12-alpine
WORKDIR /usr/src/app

COPY . .

# install modules further due to cwebp plugin crash on :alpine image
# https://github.com/cyrilwanner/next-optimized-images/issues/12 @stasglebov
# ! btw cwebp test build will fail
RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    g++ \
    libc6-compat \
    libjpeg-turbo-dev \
    libpng-dev \
    make \
    nasm

RUN npm install

CMD [ "node", "index.js" ]

