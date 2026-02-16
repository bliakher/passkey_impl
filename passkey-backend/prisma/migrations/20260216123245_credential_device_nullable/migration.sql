-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "public_key" BLOB NOT NULL,
    "counter" BIGINT NOT NULL,
    "transports" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Credential_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Credential" ("counter", "created_at", "device", "id", "public_key", "transports", "user_id") SELECT "counter", "created_at", "device", "id", "public_key", "transports", "user_id" FROM "Credential";
DROP TABLE "Credential";
ALTER TABLE "new_Credential" RENAME TO "Credential";
CREATE UNIQUE INDEX "Credential_public_key_key" ON "Credential"("public_key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
