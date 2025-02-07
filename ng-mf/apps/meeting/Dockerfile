FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4204

CMD ["npx", "nx", "run", "meeting:serve", "--host", "0.0.0.0", "--disable-host-check"]