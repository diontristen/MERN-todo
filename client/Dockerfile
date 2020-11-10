FROM node:alpine
# Create app directory
WORKDIR /usr/src/app/client
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Bundle app source
COPY . .
# Install app dependencies
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
