/*
  Warnings:

  - Added the required column `expires_at` to the `AuthChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challenge" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL
);
INSERT INTO "new_AuthChallenge" ("challenge", "created_at", "id", "user_id", "username") SELECT "challenge", "created_at", "id", "user_id", "username" FROM "AuthChallenge";
DROP TABLE "AuthChallenge";
ALTER TABLE "new_AuthChallenge" RENAME TO "AuthChallenge";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
