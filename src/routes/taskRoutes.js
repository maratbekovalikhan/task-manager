const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/taskController");

router.use(auth);

router.post("/", controller.createTask);
router.get("/", controller.getTasks);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;

