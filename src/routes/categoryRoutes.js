const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { createCategorySchema, updateCategorySchema } = require('../validators/schemas');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// All category routes require authentication
router.use(auth);

// Category routes
router.post('/', validate(createCategorySchema), createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', validate(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
