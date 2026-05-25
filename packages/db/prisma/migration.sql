-- amakers Platform — 신규 모델 마이그레이션
-- Supabase SQL 에디터에 붙여넣고 Run 클릭

-- ─── Post 테이블 컬럼 추가 ────────────────────────────────────────
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "excerpt"      TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "isHot"        BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "heroImageUrl" TEXT;
CREATE INDEX IF NOT EXISTS "Post_createdAt_idx" ON "Post"("createdAt");

-- ─── Listing 테이블 컬럼 추가 ─────────────────────────────────────
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "region"        TEXT;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "district"      TEXT;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "floor"         TEXT;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "salePrice"     INTEGER;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "fitCategories" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "tags"          TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "isFeatured"    BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "inquiryCount"  INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS "Listing_region_status_idx" ON "Listing"("region", "status");

-- ─── Contractor 테이블 — Quote 관계 준비 (변경 없음) ──────────────

-- ─── 신규 Enum 타입 ───────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "MeetingType"   AS ENUM ('OFFLINE','ONLINE','HYBRID');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "MeetingStatus" AS ENUM ('UPCOMING','ONGOING','COMPLETED','CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "IntelTrend"    AS ENUM ('UP','STABLE','DOWN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "FootTraffic"   AS ENUM ('HIGH','MEDIUM','LOW');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "RentLevel"     AS ENUM ('HIGH','MEDIUM','LOW');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "QuoteStatus"   AS ENUM ('PENDING','CONTACTED','QUOTED','ACCEPTED','DECLINED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Meeting 테이블 ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Meeting" (
  "id"                  TEXT         NOT NULL PRIMARY KEY,
  "title"               TEXT         NOT NULL,
  "description"         TEXT         NOT NULL,
  "type"                "MeetingType" NOT NULL,
  "region"              TEXT         NOT NULL,
  "location"            TEXT         NOT NULL,
  "date"                TEXT         NOT NULL,
  "startTime"           TEXT         NOT NULL,
  "endTime"             TEXT,
  "maxParticipants"     INTEGER      NOT NULL,
  "currentParticipants" INTEGER      NOT NULL DEFAULT 0,
  "isFree"              BOOLEAN      NOT NULL DEFAULT true,
  "feeWon"              INTEGER      NOT NULL DEFAULT 0,
  "status"              "MeetingStatus" NOT NULL DEFAULT 'UPCOMING',
  "hostId"              TEXT         NOT NULL REFERENCES "User"("id"),
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Meeting_region_status_idx" ON "Meeting"("region", "status");

-- ─── Intel 테이블 ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Intel" (
  "id"          TEXT          NOT NULL PRIMARY KEY,
  "title"       TEXT          NOT NULL,
  "region"      TEXT          NOT NULL,
  "district"    TEXT          NOT NULL,
  "category"    TEXT          NOT NULL,
  "trend"       "IntelTrend"  NOT NULL,
  "footTraffic" "FootTraffic" NOT NULL,
  "rentLevel"   "RentLevel"   NOT NULL,
  "summary"     TEXT          NOT NULL,
  "content"     TEXT,
  "tags"        TEXT[]        NOT NULL DEFAULT '{}',
  "views"       INTEGER       NOT NULL DEFAULT 0,
  "likes"       INTEGER       NOT NULL DEFAULT 0,
  "authorId"    TEXT          NOT NULL REFERENCES "User"("id"),
  "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Intel_region_category_idx" ON "Intel"("region", "category");
CREATE INDEX IF NOT EXISTS "Intel_trend_idx"            ON "Intel"("trend");

-- ─── Quote 테이블 ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Quote" (
  "id"           TEXT          NOT NULL PRIMARY KEY,
  "name"         TEXT          NOT NULL,
  "phone"        TEXT          NOT NULL,
  "region"       TEXT          NOT NULL,
  "area"         DOUBLE PRECISION NOT NULL,
  "budget"       INTEGER,
  "style"        TEXT,
  "notes"        TEXT,
  "contractorId" TEXT          REFERENCES "Contractor"("id"),
  "requesterId"  TEXT          REFERENCES "User"("id"),
  "status"       "QuoteStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Quote_status_idx" ON "Quote"("status");

-- ─── GuideDocument 테이블 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "GuideDocument" (
  "id"          TEXT         NOT NULL PRIMARY KEY,
  "title"       TEXT         NOT NULL,
  "description" TEXT,
  "category"    TEXT         NOT NULL,
  "fileUrl"     TEXT,
  "externalUrl" TEXT,
  "views"       INTEGER      NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN      NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GuideDocument_category_isPublished_idx" ON "GuideDocument"("category", "isPublished");
