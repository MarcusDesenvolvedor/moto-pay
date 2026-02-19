-- Step 1: Add column as nullable
ALTER TABLE "companies" ADD COLUMN "user_id" TEXT;

-- Step 2: Backfill from company_users (use the OWNER record, fallback to any record)
UPDATE "companies" c
SET "user_id" = (
  SELECT cu."user_id"
  FROM "company_users" cu
  WHERE cu."company_id" = c."id"
  ORDER BY CASE WHEN cu."role" = 'OWNER' THEN 0 ELSE 1 END, cu."created_at" ASC
  LIMIT 1
);

-- Step 3: For any companies still without a user, assign the first user in the system
UPDATE "companies"
SET "user_id" = (SELECT "id" FROM "users" ORDER BY "created_at" ASC LIMIT 1)
WHERE "user_id" IS NULL;

-- Step 4: Make column required
ALTER TABLE "companies" ALTER COLUMN "user_id" SET NOT NULL;

-- Step 5: Add foreign key
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
