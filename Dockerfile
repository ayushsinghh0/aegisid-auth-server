# 1️⃣ Base image
FROM node:20-alpine

# 2️⃣ Set working directory inside container
WORKDIR /app

# 3️⃣ Copy dependency files
COPY package.json package-lock.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy source code
COPY . .

# 6️⃣ Expose port (inside container)
EXPOSE 3000

# 7️⃣ Start the app
CMD ["npm", "run", "dev"]
