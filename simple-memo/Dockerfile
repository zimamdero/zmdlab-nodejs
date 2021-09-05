FROM node:15
WORKDIR /simple-memo
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]
EXPOSE 0