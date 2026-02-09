const API = "/api";

/* AUTH */

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) return alert(data.message);

  localStorage.setItem("token", data.token);

  location.href = "tasks.html";
}

async function register() {
  const username = r_username.value;
  const email = r_email.value;
  const password = r_password.value;

  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  if (res.ok) alert("Registered!");
}

/* TASKS */

async function loadTasks() {
  const token = localStorage.getItem("token");

  const res = await fetch(API + "/tasks", {
    headers: {
      Authorization: "Bearer " + token
    }
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
    body: JSON.stringify({
      title: title.value,
      description: description.value
    })
  });

  loadTasks();
}

async function del(id) {
  const token = localStorage.getItem("token");

  await fetch(API + "/tasks/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

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
    body: JSON.stringify({
      status: status === "pending" ? "completed" : "pending"
    })
  });

  loadTasks();
}

function logout() {
  localStorage.clear();
  location.href = "/";
}

if (location.pathname.includes("tasks.html")) {
  loadTasks();
}
