-- AlterTable
ALTER TABLE "Tree" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "githubId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
