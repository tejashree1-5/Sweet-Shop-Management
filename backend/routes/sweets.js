const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Sweet = require('../models/Sweet');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/sweets
// @desc    Add a new sweet (Admin only)
// @access  Private/Admin
router.post('/', [
  auth,
  adminAuth,
  body('name').trim().notEmpty().withMessage('Sweet name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, price, quantity } = req.body;

    const sweet = new Sweet({ name, category, price, quantity });
    await sweet.save();

    res.status(201).json(sweet);
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ message: 'Server error while creating sweet' });
  }
});

// @route   GET /api/sweets
// @desc    Get all sweets
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ message: 'Server error while fetching sweets' });
  }
});

// @route   GET /api/sweets/search
// @desc    Search sweets by name, category, or price range
// @access  Private
router.get('/search', [
  auth,
  query('name').optional().trim(),
  query('category').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ message: 'Server error while searching sweets' });
  }
});

// @route   GET /api/sweets/:id
// @desc    Get a single sweet
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    res.json(sweet);
  } catch (error) {
    console.error('Get sweet error:', error);
    res.status(500).json({ message: 'Server error while fetching sweet' });
  }
});

// @route   PUT /api/sweets/:id
// @desc    Update a sweet (Admin only)
// @access  Private/Admin
router.put('/:id', [
  auth,
  adminAuth,
  body('name').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    const { name, category, price, quantity } = req.body;
    if (name) sweet.name = name;
    if (category) sweet.category = category;
    if (price !== undefined) sweet.price = price;
    if (quantity !== undefined) sweet.quantity = quantity;

    await sweet.save();
    res.json(sweet);
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ message: 'Server error while updating sweet' });
  }
});

// @route   DELETE /api/sweets/:id
// @desc    Delete a sweet (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    await sweet.deleteOne();
    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ message: 'Server error while deleting sweet' });
  }
});

// @route   POST /api/sweets/:id/purchase
// @desc    Purchase a sweet (decrease quantity)
// @access  Private
router.post('/:id/purchase', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: 'Sweet is out of stock' });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.json({ message: 'Purchase successful', sweet });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Server error during purchase' });
  }
});

// @route   POST /api/sweets/:id/restock
// @desc    Restock a sweet (increase quantity) (Admin only)
// @access  Private/Admin
router.post('/:id/restock', [
  auth,
  adminAuth,
  body('quantity').isInt({ min: 1 }).withMessage('Restock quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    const { quantity } = req.body;
    sweet.quantity += parseInt(quantity);
    await sweet.save();

    res.json({ message: 'Restock successful', sweet });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ message: 'Server error during restock' });
  }
});

module.exports = router;

