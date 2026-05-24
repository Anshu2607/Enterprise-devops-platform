/*
  Warnings:

  - You are about to drop the column `repository` on the `Project` table. All the data in the column will be lost.
  - Made the column `logs` on table `Deployment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "deployedUrl" TEXT,
ADD COLUMN     "repoUrl" TEXT,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "logs" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "repository",
ADD COLUMN     "description" TEXT;
