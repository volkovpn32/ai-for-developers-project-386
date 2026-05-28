FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM gradle:8-jdk21 AS backend-build
WORKDIR /app
COPY backend/ .
RUN ./gradlew build -x test

FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache nginx gettext
COPY --from=frontend-build /app/dist/frontend/browser /usr/share/nginx/html
COPY --from=backend-build /app/build/quarkus-app /app/quarkus-app
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh
ENV PORT=8080
EXPOSE ${PORT}
CMD ["/start.sh"]