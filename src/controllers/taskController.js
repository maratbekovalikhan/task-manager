const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const userTasks = await Task.countDocuments({ user: req.user._id });

  if (req.user.role === "user" && userTasks >= 5) {
    return res.status(403).json({ message: "Upgrade to premium to create more tasks" });
  }

  const task = await Task.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  let tasks;

  if (["moderator", "admin"].includes(req.user.role)) {
    tasks = await Task.find();
  } else {
    tasks = await Task.find({ user: req.user._id });
  }

  res.json(tasks);
};

// ⚠️ Добавляем эту функцию
exports.getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  // Только владелец или модератор/админ
  if (req.user.role === "user" && task.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(task);
};

exports.updateTask = async (req, res) => {
  let task;

  if (["moderator", "admin"].includes(req.user.role)) {
    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  } else {
    task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
  }

  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  if (req.user.role === "user" && task.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  await task.deleteOne();

  res.json({ message: "Deleted" });
};
