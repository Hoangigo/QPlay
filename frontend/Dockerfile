FROM node:17

WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .
CMD ["/bin/bash", "-c", "npm run dev"]