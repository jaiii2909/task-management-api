const Joi = require('joi');

// User registration validation
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Task creation validation
const createTaskSchema = Joi.object({
  title: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .max(1000)
    .required()
    .messages({
      'string.max': 'Description cannot exceed 1000 characters',
      'any.required': 'Description is required'
    }),
  dueDate: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.min': 'Due date cannot be in the past',
      'any.required': 'Due date is required'
    }),
  status: Joi.string()
    .valid('pending', 'completed')
    .default('pending')
    .messages({
      'any.only': 'Status must be either pending or completed'
    })
});

// Task update validation (all fields optional)
const updateTaskSchema = Joi.object({
  title: Joi.string()
    .max(200)
    .messages({
      'string.max': 'Title cannot exceed 200 characters'
    }),
  description: Joi.string()
    .max(1000)
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  dueDate: Joi.date()
    .iso()
    .messages({
      'date.base': 'Due date must be a valid date'
    }),
  status: Joi.string()
    .valid('pending', 'completed')
    .messages({
      'any.only': 'Status must be either pending or completed'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

module.exports = {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema
};
