-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "parts" JSONB,
ALTER COLUMN "content" DROP NOT NULL;
