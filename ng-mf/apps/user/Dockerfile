FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4205

CMD ["npx", "nx", "run", "user:serve", "--host", "0.0.0.0", "--disable-host-check"]