FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g pm2 
COPY ./ ./
RUN npm run build

ENTRYPOINT [ "npm", "run", "start-pm2" ]