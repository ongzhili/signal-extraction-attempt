# frontend/Dockerfile
# Stage 1: build the React app
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build  # creates /app/dist

# Stage 2: serve static files
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]