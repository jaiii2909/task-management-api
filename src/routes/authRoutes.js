const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../validators/schemas');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Private routes
router.get('/profile', auth, getProfile);

module.exports = router;
