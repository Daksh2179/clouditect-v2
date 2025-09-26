FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Create production build
RUN npm run build

# Serve with lightweight server
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]