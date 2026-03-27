# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Kopiér package files
COPY package.json yarn.lock ./

# Installer dependencies
RUN yarn install --frozen-lockfile

# Kopiér resten af projektet
COPY . .

# Byg Next.js app
RUN yarn build

# 2. Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Kopiér kun det nødvendige fra builder
COPY --from=builder /app ./

EXPOSE 3000

# Start appen
CMD ["yarn", "start"]