const fs = require('fs');
const path = require('path');
const { sendEmail } = require('../utils/emailSender');

const filePath = path.join(__dirname, '..', 'tasks.json');

function readTasks() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
  return JSON.parse(fs.readFileSync(filePath));
}

function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

exports.getTasks = (req, res) => {
  res.json(readTasks());
};

exports.addTask = (req, res) => {
  const tasks = readTasks();
  const newTask = { id: Date.now(), text: req.body.text, completed: false };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
};

exports.completeTask = (req, res) => {
  const tasks = readTasks();
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
    writeTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send();
  }
};

exports.deleteTask = (req, res) => {
  const tasks = readTasks().filter(t => t.id !== parseInt(req.params.id));
  writeTasks(tasks);
  res.status(204).send();
};

exports.sendPendingTasksEmail = async (req, res) => {
  const tasks = readTasks().filter(t => !t.completed);
  const email = req.body.email;
  const content = tasks.length > 0
    ? `Tarefas pendentes:\n\n${tasks.map(t => `- ${t.text}`).join('\n')}`
    : 'Parabéns! Você não tem tarefas pendentes.';

  await sendEmail(email, 'Lembrete de Tarefas Pendentes', content);
  res.send({ message: 'Email enviado com sucesso!' });
};
