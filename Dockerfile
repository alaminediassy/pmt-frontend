# Dockerfile pour le frontend Angular
# Étape de construction
FROM node:16 AS builder
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build Angular
COPY . .
RUN npm run build --prod

# Étape de déploiement avec Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/your-app-name /usr/share/nginx/html
EXPOSE 80

# Commande de démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
