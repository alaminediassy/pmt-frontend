# Dockerfile pour le frontend Angular
# Étape de construction
FROM node:20 AS builder
WORKDIR /app

# Installation des dépendances en cache
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copie du reste du code source et build Angular
COPY . .
RUN npm run build --prod

# Étape de déploiement Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/pmt-frontend /usr/share/nginx/html
EXPOSE 80

# Commande de démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
