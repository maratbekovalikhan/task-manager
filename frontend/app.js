const API_URL = "https://task-manager-y06e.onrender.com/api";

/* ===== DOM элементы ===== */
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const rUsernameInput = document.getElementById("r_username");
const rEmailInput = document.getElementById("r_email");
const rPasswordInput = document.getElementById("r_password");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const tasksEl = document.getElementById("tasks");

/* ===== AUTH ===== */
async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  window.location.href = "tasks.html";
}

async function register() {
  const username = rUsernameInput.value;
  const email = rEmailInput.value;
  const password = rPasswordInput.value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Register failed");
    return;
  }

  alert("Registered successfully. Now login.");
}

/* ===== TASKS ===== */
async function createTask() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Not authorized");

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      title: titleInput.value,
      description: descriptionInput.value
    })
  });

  if (!res.ok) {
    const err = await res.json();
    alert(err.message || "Task creation failed");
    return;
  }

  titleInput.value = "";
  descriptionInput.value = "";
  loadTasks();
}

async function loadTasks() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch(`${API_URL}/tasks`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) {
    tasksEl.innerHTML = "Failed to load tasks.";
    return;
  }

  const tasks = await res.json();
  tasksEl.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${t.title}</strong> - ${t.description} 
      [${t.completed ? "✅" : "❌"}] 
      <button onclick="deleteTask('${t._id}')">Delete</button>
      <button onclick="toggleTask('${t._id}', ${t.completed})">Toggle</button>
    `;
    tasksEl.appendChild(li);
  });
}

async function deleteTask(id) {
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  loadTasks();
}

async function toggleTask(id, completed) {
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ completed: !completed })
  });

  loadTasks();
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* ===== AUTO LOAD ===== */
if (window.location.pathname.includes("tasks.html")) {
  loadTasks();
}
