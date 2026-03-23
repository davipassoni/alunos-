/*
  Warnings:

  - Added the required column `alunoId` to the `cursos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cursos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cursos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cursos" ("cargaHoraria", "createdAt", "descricao", "id", "nome", "professor", "updatedAt") SELECT "cargaHoraria", "createdAt", "descricao", "id", "nome", "professor", "updatedAt" FROM "cursos";
DROP TABLE "cursos";
ALTER TABLE "new_cursos" RENAME TO "cursos";
CREATE UNIQUE INDEX "cursos_nome_key" ON "cursos"("nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
