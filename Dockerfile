FROM node

COPY package.json .
RUN npm install
COPY . .

CMD ["node", "/bin/www"]
EXPOSE 8000