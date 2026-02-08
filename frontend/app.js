const API_URL = "http://localhost:5000/api";

function register() {
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  })
  .then(res => res.json())
  .then(data => {
    if(data.token) {
      localStorage.setItem("token", data.token);
      alert("Registered successfully!");
      window.location.href = "tasks.html";
    } else {
      alert(data.message);
    }
  });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if(data.token) {
      localStorage.setItem("token", data.token);
      alert("Logged in!");
      window.location.href = "tasks.html";
    } else {
      alert(data.message);
    }
  });
}

function loadTasks() {
  const token = localStorage.getItem("token");
  fetch(`${API_URL}/tasks`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(tasks => {
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    tasks.forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.title} - ${t.description} [${t.status}]`;
      list.appendChild(li);
    });
  });
}

function createTask() {
  const token = localStorage.getItem("token");
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const dueDate = document.getElementById("task-due").value;

  fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ title, description, dueDate, status: "pending" })
  })
  .then(res => res.json())
  .then(data => {
    alert("Task created!");
    loadTasks();
  });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

if(window.location.pathname.includes("tasks.html")) {
  loadTasks();
}
