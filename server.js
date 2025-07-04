const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

let tasks = [];
let nextId = 1;


app.get('/tasks', (req, res) => {
  res.json(tasks);
});


app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Texto obrigatório' });

  const newTask = { id: nextId++, text, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});


app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

  task.completed = true;
  res.json(task);
});


app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});


app.post('/tasks/send-email', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

  const pending = tasks.filter(t => !t.completed);
  if (pending.length === 0) return res.json({ message: 'Sem tarefas pendentes' });

  const taskList = pending.map(t => `- ${t.text}`).join('\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lararafaella@gmail.com',         
      pass: 'smxl pvik mzov dkcz'                
    }
  });

  const mailOptions = {
    from: 'lararafaella@gmail.com',
    to: email,
    subject: 'Alerta de Tarefas Pendentes',
    text: `Você tem as seguintes tarefas pendentes:\n\n${taskList}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ error: error.toString() });
    res.json({ message: 'Email enviado com sucesso!' });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
