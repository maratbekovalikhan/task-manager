const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  next();
};

router.post("/register", validate(registerValidator), register);
router.post("/login", validate(loginValidator), login);

module.exports = router;
