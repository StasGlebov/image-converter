FROM node:12-alpine
WORKDIR /usr/src/app

COPY . .
#COPY ./entrypoint.sh /usr/bin/entrypoint.sh
#ENTRYPOINT [ "entrypoint.sh" ]

RUN npm install
CMD [ "node", "index.js" ]
#CMD ["echo", "!!!!!!!! Container_A is available now !!!!!!!!"]

