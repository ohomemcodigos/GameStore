# Usa a imagem base do Node 18
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia e instala as dependências da aplicação
# O Docker usa estes arquivos para determinar se precisa reinstalar o node_modules
COPY package*.json ./

# Instala as dependências, incluindo as de desenvolvimento (necessárias para ts-node)
RUN npm install

# Copia o restante do código da API
# Isso inclui src/, prisma/, config/, e outros arquivos necessários.
COPY . .

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]