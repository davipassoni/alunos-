/*
  Warnings:

  - You are about to drop the column `alunoId` on the `cursos` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_alunosTocursos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_alunosTocursos_A_fkey" FOREIGN KEY ("A") REFERENCES "alunos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_alunosTocursos_B_fkey" FOREIGN KEY ("B") REFERENCES "cursos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cursos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_cursos" ("cargaHoraria", "createdAt", "descricao", "id", "nome", "professor", "updatedAt") SELECT "cargaHoraria", "createdAt", "descricao", "id", "nome", "professor", "updatedAt" FROM "cursos";
DROP TABLE "cursos";
ALTER TABLE "new_cursos" RENAME TO "cursos";
CREATE UNIQUE INDEX "cursos_nome_key" ON "cursos"("nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_alunosTocursos_AB_unique" ON "_alunosTocursos"("A", "B");

-- CreateIndex
CREATE INDEX "_alunosTocursos_B_index" ON "_alunosTocursos"("B");
