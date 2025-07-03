# ==== BUILD STAGE ====
FROM node:20 as builder

WORKDIR /app

COPY package*.json prisma/ tsconfig*.json ./
RUN npm install

COPY . .
RUN npx prisma generate && npm run build

# ==== RUNTIME STAGE ====
FROM node:20-alpine

WORKDIR /app

RUN apk update 

RUN apk add --no-cache shadow

WORKDIR /app

COPY  package*.json tsconfig*.json /app/

COPY  scripts/ ./scripts

COPY  prisma/ ./prisma

COPY  config/ ./config

COPY  --from=builder /app/dist ./dist

COPY  --from=builder /app/node_modules ./node_modules

RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

RUN apk add --no-cache bash dumb-init openssh-client sshpass postgresql-client && \
  rm -rf /var/lib/apt/lists/* && \
  chmod +x ./scripts/entry.sh && \
  chmod +x ./scripts/wait.sh


RUN chown -R node:node ./node_modules 

USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--", "./scripts/entry.sh"]
