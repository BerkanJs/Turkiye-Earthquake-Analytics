


FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


RUN cp .env.production .env && npm run build



FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
