const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar o banco de dados
async function initDb() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  return db;
}

// Obter todas as tarefas
app.get('/tasks', async (req, res) => {
  const db = await initDb();
  const tasks = await db.all('SELECT * FROM tarefas');
  res.json(tasks);
});

// Adicionar uma tarefa
app.post('/add-task', async (req, res) => {
  const { nome, datac, prioridade } = req.body;

  if (!nome || !datac || !prioridade) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const db = await initDb();
    await db.run(
      `INSERT INTO tarefas (nome, datac, prioridade) VALUES (?, ?, ?)`,
      [nome, datac, prioridade]
    );
    res.status(201).json({ message: 'Tarefa adicionada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar tarefa.', error });
  }
});

// Rota para editar uma tarefa
app.put('/edit-task/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, datac, prioridade } = req.body;

  if (!nome || !datac || !prioridade) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const db = await initDb();
    const result = await db.run(
      `UPDATE tarefas SET nome = ?, datac = ?, prioridade = ? WHERE id = ?`,
      [nome, datac, prioridade, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa.', error });
  }
});

//Deletar uma tarefa
app.delete('/delete-task/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await initDb();
    const result = await db.run(`DELETE FROM tarefas WHERE id = ?`, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar tarefa.', error });
  }
});

// Exibir a página inicial (front-end)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
