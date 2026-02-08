const Joi = require("joi");

exports.createTaskValidator = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "completed"),
  dueDate: Joi.date(),
});

exports.updateTaskValidator = Joi.object({
  title: Joi.string().min(3),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "completed"),
  dueDate: Joi.date(),
});
