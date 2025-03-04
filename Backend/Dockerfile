# Usa la imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto en el que corre el backend
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "src/index.js"]
