FROM node:15
WORKDIR /weblab
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]
EXPOSE 1000