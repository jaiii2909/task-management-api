const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color code']
  },
  userId: {
    type: Number,
    required: [true, 'User ID is required'],
    index: true
  }
}, {
  timestamps: true
});

// Index for better query performance
categorySchema.index({ userId: 1, name: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
