-- Add user_id column (nullable first)
ALTER TABLE "vehicles" ADD COLUMN "user_id" TEXT;

-- Backfill from company: vehicle's company -> company.user_id
UPDATE "vehicles" v
SET "user_id" = (
  SELECT c."user_id"
  FROM "companies" c
  WHERE c."id" = v."company_id"
  LIMIT 1
);

-- Fallback: assign first user for any vehicles still without user_id
UPDATE "vehicles"
SET "user_id" = (SELECT "id" FROM "users" ORDER BY "created_at" ASC LIMIT 1)
WHERE "user_id" IS NULL;

-- Make user_id required
ALTER TABLE "vehicles" ALTER COLUMN "user_id" SET NOT NULL;

-- Drop company_id (FK to companies is dropped automatically)
ALTER TABLE "vehicles" DROP COLUMN "company_id";

-- Add FK to users
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
