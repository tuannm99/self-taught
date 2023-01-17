FROM node:14-alpine

WORKDIR /app

COPY . /app/
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "watch"]

HEALTHCHECK --interval=30s CMD wget -qO- localhost:5000/api/healthcheck
