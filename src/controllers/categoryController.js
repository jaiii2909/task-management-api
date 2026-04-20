const Category = require('../models/Category');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      name: name.toLowerCase(),
      userId: req.user.id
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name: name.toLowerCase(),
      description,
      color: color || '#3B82F6',
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories for authenticated user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ userId: req.user.id })
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category belongs to authenticated user
    if (category.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this category.'
      });
    }

    res.status(200).json({
      success: true,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category belongs to authenticated user
    if (category.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to modify this category.'
      });
    }

    const { name, description, color } = req.body;

    // Check if new name conflicts with existing category
    if (name && name.toLowerCase() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.toLowerCase(),
        userId: req.user.id,
        _id: { $ne: category._id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Update category fields
    if (name !== undefined) category.name = name.toLowerCase();
    if (description !== undefined) category.description = description;
    if (color !== undefined) category.color = color;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category belongs to authenticated user
    if (category.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to delete this category.'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
