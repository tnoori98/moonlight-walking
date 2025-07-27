FROM node:22

WORKDIR /app

COPY .

RUN npm install
RUN npm run build
# RUN npm run generate

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["npm", "run", "start"]