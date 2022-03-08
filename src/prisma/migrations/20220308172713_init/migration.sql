-- CreateTable
CREATE TABLE "absence" (
    "id" SERIAL NOT NULL,
    "firstWarning" INTEGER NOT NULL DEFAULT 3,
    "secondWarning" INTEGER NOT NULL DEFAULT 4,
    "thirdWarning" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "absence_pkey" PRIMARY KEY ("id")
);
