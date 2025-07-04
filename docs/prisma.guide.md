# Prisma 操作與 schema 語法總整理

## 🧩 Prisma 常用指令

| 指令                                     | 說明                                        |
| -------------------------------------- | ----------------------------------------- |
| `npx prisma init`                      | 初始化 Prisma 專案，建立 `schema.prisma` 與 `.env` |
| `npx prisma generate`                  | 依據 schema 產生 Prisma Client 型別與方法          |
| `npx prisma migrate dev --name xxx`    | 建立 migration 並更新資料庫                       |
| `npx prisma migrate reset`             | 清空資料庫並重建所有 migration（僅開發用）                |
| `npx prisma migrate deploy`             | 執行 prisma/migrations/ 目錄下尚未執行的 migration（含 raw SQL 建立 VIEW）                |
| `npx prisma db push`                   | 直接將 schema 寫入資料庫（跳過 migration）            |
| `npx prisma migrate dev --create-only` | 僅產生 migration SQL，不 apply                 |
| `npx prisma format`                    | 格式化 schema.prisma                         |
| `npx prisma studio`                    | 啟動 GUI 管理介面                               |
| `npx prisma migrate resolve`           | 手動標示 migration 狀態                         |

---

## 🧩 `schema.prisma` 語法整理

### 📌 資料型別

| Prisma     | PostgreSQL 對應           | 備註                      |
| ---------- | ----------------------- | ----------------------- |
| `String`   | TEXT / VARCHAR          |                         |
| `Int`      | INTEGER                 |                         |
| `Float`    | REAL                    |                         |
| `Boolean`  | BOOLEAN                 |                         |
| `DateTime` | TIMESTAMP / TIMESTAMPTZ | 可加 `@db.Timestamptz`    |
| `Decimal`  | DECIMAL(65, 30)         | 可加 `@db.Decimal(10, 2)` |

### 📌 特殊屬性

| 屬性                 | 說明                                                  |
| ------------------ | --------------------------------------------------- |
| `@id`              | 主鍵                                                  |
| `@default(...)`    | 預設值，如 `@default(now())`、`@default(autoincrement())` |
| `@unique`          | 唯一鍵                                                 |
| `@map("xxx")`      | 對應資料庫的欄位名稱                                          |
| `@@map("xxx")`     | 對應資料庫的表名                                            |
| `@@id([a, b])`     | 複合主鍵                                                |
| `@@unique([a, b])` | 複合唯一鍵                                               |
| `@@index([a, b])`  | 建立 index                                            |
| `@@ignore`         | 忽略 Prisma Client 操作，但仍可參與 migration（舊版本則完全略過）       |


### 👥 關聯定義

#### 一對多

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  userId   Int  @map("user_id")
  user     User? @relation(fields: [userId], references: [id], onDelete: SetNull, onUpdate: Cascade)
}
```

#### 一對一

```prisma
model User {
  id      Int          @id @default(autoincrement())
  profile UserProfile?
}

model UserProfile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### 多對多（中介表）

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[] @relation("UserPosts")
}

model Post {
  id    Int    @id @default(autoincrement())
  users User[] @relation("UserPosts")
}
```

<p>note: 針對型別定義後面加上?來宣告是否為nullable，若是nullable，再onDelete或onUpdate才可以做SetNull，不然預設都只能Cascade</p>


### 🔢 Enum 宣告

```prisma
enum Gender {
  MALE
  FEMALE
}

model UserProfile {
  id     Int    @id @default(autoincrement())
  gender Gender @default(MALE)
}
```

### 📊 Decimal 精度

```prisma
price Decimal @db.Decimal(10, 2)
```

### 🗐 View 宣告（Prisma 5.4+）

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["views"]
}

view UserPostCount {
  userId    Int @map("user_id")
  postCount Int @map("post_count")

  @@map("user_post_count")
}
```

### 📑 TimescaleDB Hypertable

Migration SQL：

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable(
  'user_logs',
  'created_at',
  chunk_time_interval => INTERVAL '1 day'
);
```

schema.prisma：

```prisma
model UserLog {
  userId      Int      @map("user_id")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  description String   @default("no description") @map("description")

  @@id([userId, createdAt])
  @@map("user_logs")
}
```

---

## ✨ Prisma Client 實用技巧（Transaction / InsertMany / RawSQL）

### ✅ Transaction 多筆操作

**批次交易（無相依）：**

```ts
await prisma.$transaction([
  prisma.user.create({ data: { email: 'a@example.com' } }),
  prisma.post.create({ data: { title: 'Hello', authorId: 1 } }),
]);
```

**具依賴邏輯（嵌套 async tx）：**

```ts
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { email: 'a@example.com' } });
  await tx.post.create({ data: { title: 'Hi', authorId: user.id } });
});
```

---

### ✅ InsertMany 並跳過重複（ON CONFLICT DO NOTHING）

```ts
await prisma.user.createMany({
  data: [
    { email: 'a@example.com' },
    { email: 'b@example.com' },
  ],
  skipDuplicates: true,
});
```

---

### ✅ 單筆 UPSERT

```ts
await prisma.user.upsert({
  where: { email: 'a@example.com' },
  create: { email: 'a@example.com', name: 'Alice' },
  update: { name: 'Updated Alice' },
});
```

---

### ✅ Raw SQL 查詢與寫入

**查詢：**

```ts
const result = await prisma.$queryRaw<{ user_id: number; post_count: number }[]>`
  SELECT * FROM user_post_count WHERE user_id = ${userId}
`;
```

**寫入 / 更新 / 刪除：**

```ts
await prisma.$executeRaw`
  INSERT INTO logs (user_id, action) VALUES (${userId}, ${'login'})
`;
```