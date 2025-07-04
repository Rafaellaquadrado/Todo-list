const apiUrl = 'http://localhost:3000/tasks';

function fetchTasks() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      data.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.textContent = task.text;

        li.onclick = () => completeTask(task.id);

        const btn = document.createElement('button');
        btn.textContent = '❌';
        btn.style.marginLeft = '10px';
        btn.onclick = e => {
          e.stopPropagation();
          deleteTask(task.id);
        };

        li.appendChild(btn);
        list.appendChild(li);
      });
    });
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ text })
  }).then(() => {
    input.value = '';
    fetchTasks();
  });
}

function completeTask(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  }).then(fetchTasks);
}

function deleteTask(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  }).then(fetchTasks);
}

function sendEmail() {
  const email = document.getElementById('emailInput').value;
  if (!email) return alert('Digite um e-mail válido.');

  fetch(`${apiUrl}/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(msg => alert(msg.message || 'Email enviado!'));
}

fetchTasks();
