FROM node:15
WORKDIR /simple-socket
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "simple-socket.js"]
EXPOSE 0