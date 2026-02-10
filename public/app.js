const API = "/api";

/* ===== SWITCH FORMS ===== */

function showRegister() {
  document.getElementById("loginCard").style.display = "none";
  document.getElementById("registerCard").style.display = "block";
}

function showLogin() {
  document.getElementById("registerCard").style.display = "none";
  document.getElementById("loginCard").style.display = "block";
}

/* ===== DOM ===== */

const email = document.getElementById("email");
const password = document.getElementById("password");

const r_username = document.getElementById("r_username");
const r_email = document.getElementById("r_email");
const r_password = document.getElementById("r_password");

const title = document.getElementById("title");
const description = document.getElementById("description");

/* ===== AUTH ===== */

async function login() {
  try {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message || "Login error");

    localStorage.setItem("token", data.token);

    location.href = "tasks.html";

  } catch (err) {
    alert("Server error");
  }
}

async function register() {
  try {
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

    if (!res.ok) return alert(data.message || "Register error");

    alert("Registered! Now login.");
    showLogin();

  } catch (err) {
    alert("Server error");
  }
}

/* ===== TASKS ===== */

async function loadTasks() {
  const token = localStorage.getItem("token");

  if (!token) return logout();

  try {
    const res = await fetch(API + "/tasks", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) return alert("Auth error");

    const data = await res.json();

    const ul = document.getElementById("tasks");
    ul.innerHTML = "";

    data.forEach(t => {

      const li = document.createElement("li");

      li.className = "task " + (t.status === "completed" ? "done" : "");

      li.innerHTML = `
        <div>
          <b>${t.title}</b><br>
          <small>${t.description || ""}</small>
        </div>

        <div>
          <button onclick="toggle('${t._id}','${t.status}')">✔</button>
          <button onclick="del('${t._id}')">✖</button>
        </div>
      `;

      ul.appendChild(li);
    });

  } catch (err) {
    alert("Cannot load tasks");
  }
}

async function createTask() {
  const token = localStorage.getItem("token");

  if (!title.value) return alert("Enter title");

  try {
    const res = await fetch(API + "/tasks", {
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

    const data = await res.json();

    if (!res.ok) return alert(data.message || "Error");

    title.value = "";
    description.value = "";

    loadTasks();

  } catch (err) {
    alert("Server error");
  }
}

async function del(id) {
  const token = localStorage.getItem("token");

  if (!confirm("Delete task?")) return;

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

/* ===== LOGOUT ===== */

function logout() {
  localStorage.clear();
  location.href = "/";
}

/* ===== AUTO LOAD ===== */

if (location.pathname.includes("tasks.html")) {
  loadTasks();
}
