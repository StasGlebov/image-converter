FROM node:12-alpine
<<<<<<< HEAD
WORKDIR /usr/app

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
=======
WORKDIR /usr/src/app

COPY . .
#COPY ./entrypoint.sh /usr/bin/entrypoint.sh
#ENTRYPOINT [ "entrypoint.sh" ]

RUN npm install
CMD [ "node", "index.js" ]
#CMD ["echo", "!!!!!!!! Container_A is available now !!!!!!!!"]
>>>>>>> 61fa2b28c5cc9eff2c8ddcabca2014435dc55a9e

