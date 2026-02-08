const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/taskController");

const {
  createTaskValidator,
  updateTaskValidator,
} = require("../validators/taskValidator");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  next();
};

router.use(auth);

router.post("/", validate(createTaskValidator), controller.createTask);

router.get("/", controller.getTasks);

router.get("/:id", controller.getTaskById);

router.put("/:id", validate(updateTaskValidator), controller.updateTask);

router.delete("/:id", controller.deleteTask);

module.exports = router;
