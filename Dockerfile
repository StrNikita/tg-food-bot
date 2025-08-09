# Выбираем базовый образ с нужной версией Node.js
FROM node:20.11.1-alpine
# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы package.json и package-lock.json в рабочую директорию
COPY package.json package-lock.json ./

# Устанавливаем зависимости с помощью npm
RUN npm install

# Копируем исходный код приложения в контейнер
COPY . .

# Компилируем проект, если это необходимо
RUN npm run build

RUN npm prune --production

# Определяем команду для запуска приложения
CMD ["npm", "run", "start:prod"]
