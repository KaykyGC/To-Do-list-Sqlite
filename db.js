// db.js (Este arquivo cria a tabela no banco de dados)
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function initDb() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  // Criar a tabela de tarefas se ela não existir
  await db.run(
    `CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      datac DATE NOT NULL,
      prioridade TEXT NOT NULL
    )`
  );

  return db;
}

initDb().then(() => console.log('Banco de dados inicializado!'));
