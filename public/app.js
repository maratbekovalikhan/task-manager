const API = "/api";

function showRegister() {
  document.getElementById("loginCard").style.display = "none";
  document.getElementById("registerCard").style.display = "block";
}

function showLogin() {
  document.getElementById("registerCard").style.display = "none";
  document.getElementById("loginCard").style.display = "block";
}

const email = document.getElementById("email");
const password = document.getElementById("password");

const r_username = document.getElementById("r_username");
const r_email = document.getElementById("r_email");
const r_password = document.getElementById("r_password");

const title = document.getElementById("title");
const description = document.getElementById("description");

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

  } catch {
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

  } catch {
    alert("Server error");
  }
}

async function loadTasks() {
  const token = localStorage.getItem("token");

  if (!token) return logout();

  try {
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

  } catch {
    alert("Cannot load tasks");
  }
}

async function createTask() {
  const token = localStorage.getItem("token");

  if (!title.value) return alert("Enter title");

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

async function loadProfile() {
  const token = localStorage.getItem("token");

  if (!token) return logout();

  const res = await fetch(API + "/users/profile", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();

  document.getElementById("username").value = data.username;
  document.getElementById("email").value = data.email;
  document.getElementById("role").innerText = data.role;
}

async function updateProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch(API + "/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      username: username.value,
      email: email.value
    })
  });

  if (!res.ok) return alert("Update error");

  alert("Profile updated!");
}

function logout() {
  localStorage.clear();
  location.href = "/";
}

if (location.pathname.includes("tasks.html")) {
  loadTasks();
}

if (location.pathname.includes("profile.html")) {
  loadProfile();
}
