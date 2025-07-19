function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

function toggleTimeInput() {
  const selectedType = document.querySelector('input[name="taskType"]:checked').value;
  const taskTime = document.getElementById('taskTime');
  taskTime.style.display = (selectedType === 'timed') ? 'block' : 'none';
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskTime = document.getElementById('taskTime');
  const taskType = document.querySelector('input[name="taskType"]:checked').value;
  const taskText = taskInput.value.trim();

  if (!taskText) return alert("Please enter a task");

  const task = {
    text: taskText,
    type: taskType,
    time: taskTime.value,
    completed: false
  };

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  alert("Task saved!");

  if (taskType === 'timed') {
    const alarmTime = new Date(task.time);
    const delay = alarmTime.getTime() - new Date().getTime();

    if (!isNaN(alarmTime.getTime()) && delay > 0) {
      requestNotificationPermission().then(() => {
        setTimeout(() => {
          showNotification(`Reminder: ${task.text}`);
        }, delay);
      });
    } else {
      alert("Set a valid future time.");
    }
  }

  taskInput.value = '';
  taskTime.value = '';
  toggleTimeInput();
}

function requestNotificationPermission() {
  if (Notification.permission === 'granted') return Promise.resolve();
  return Notification.requestPermission();
}

function showNotification(message) {
  if (Notification.permission === 'granted') {
    new Notification("Task Reminder", {
      body: message,
      icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png'
    });
  }
}

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function editTask(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
  }
}

function toggleTaskCompletion(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function loadTasks() {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <label><input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTaskCompletion(${index})"> ${task.text} ${task.time ? '⏰ ' + task.time : ''}</label>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem('tasks');
    const taskList = document.getElementById('taskList');
    if (taskList) taskList.innerHTML = '';
  }
}

function openAddTask() {
  window.location.href = "index.html";
}

function showAllTasks() {
  window.location.href = "tasks.html";
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  const darkToggle = document.getElementById('darkModeToggle');
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) document.body.classList.add('dark');
  if (darkToggle) darkToggle.checked = isDark;
});

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}
