FROM node

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN yarn

COPY ./ ./

EXPOSE 3001

CMD ["npm", "start"]