-- CreateTable
CREATE TABLE "post_apply_tag" (
    "post_id" INTEGER NOT NULL,
    "tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_apply_tag_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_apply_tag_post_id_tag_id_key" ON "post_apply_tag"("post_id", "tag_id");

-- AddForeignKey
ALTER TABLE "post_apply_tag" ADD CONSTRAINT "post_apply_tag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_apply_tag" ADD CONSTRAINT "post_apply_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("name") ON DELETE CASCADE ON UPDATE CASCADE;
