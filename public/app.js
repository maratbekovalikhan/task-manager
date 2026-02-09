const API = "/api";

/* ===== DOM ELEMENTS ===== */
const email = document.getElementById("email");
const password = document.getElementById("password");

const r_username = document.getElementById("r_username");
const r_email = document.getElementById("r_email");
const r_password = document.getElementById("r_password");

const title = document.getElementById("title");
const description = document.getElementById("description");

/* ===== AUTH ===== */
async function login() {
  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value, password: password.value })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Login failed");

  localStorage.setItem("token", data.token);
  location.href = "tasks.html";
}

async function register() {
  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: r_username.value,
      email: r_email.value,
      password: r_password.value
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Register failed");

  alert("Registered successfully. Now login.");
}

/* ===== TASKS ===== */
async function loadTasks() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch(API + "/tasks", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  const ul = document.getElementById("tasks");
  ul.innerHTML = "";

  data.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${t.title} - ${t.status}
      <button onclick="del('${t._id}')">X</button>
      <button onclick="toggle('${t._id}','${t.status}')">✔</button>
    `;
    ul.appendChild(li);
  });
}

async function createTask() {
  const token = localStorage.getItem("token");
  await fetch(API + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ title: title.value, description: description.value })
  });

  title.value = "";
  description.value = "";
  loadTasks();
}

async function del(id) {
  const token = localStorage.getItem("token");
  await fetch(API + "/tasks/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
  loadTasks();
}

async function toggle(id, status) {
  const token = localStorage.getItem("token");
  await fetch(API + "/tasks/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ status: status === "pending" ? "completed" : "pending" })
  });
  loadTasks();
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.clear();
  location.href = "/";
}

/* ===== AUTO LOAD TASKS ===== */
if (location.pathname.includes("tasks.html")) loadTasks();

