# Nest Postgres Prisma Practice

## Init Project

### install package

```shell=
npm ci
```

### Copy node config for local env edit

1. create file config/local.js
2. copy content config/default.js to config/local.js
3. edit config/local.js for local develop

### Copy process env file (for prisma cli)

1. create file .env
2. copy content .env.example to .env
3. edit .env for local develop

### Run dev

```shell=
npm run start:dev
```

## Prisma Operate

### Init Prisma (if has prisma folder , skip)
```shell=
npx prisma init
```

### 

### Deploy Migration
```shell=
npx prisma migrate deploy
```
### Edit prisma/schema.prisma model

1. edit model

2. run migrate dev

```shell=
npx prisma migrate dev --name {your_migration_info}
```

### Execute raw sql for Partition or View 

1. run migrate dev --create-only

```shell=
npx prisma migrate dev --create-only --name {your_migration_info}
```
2. run deploy

```shell=
npx prisma migrate deploy
```

### Update Prisma Client

```
npx prisma generate
```