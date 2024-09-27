const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Get all categories
router.get('/', async (req, res) => {
  try {
    const catdata = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(catdata);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// Get one category by its `id`
router.get('/:id', async (req, res) => {
  try {
    const catdata = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });

    if (!catdata) {
      return res.status(404).json({ message: 'No category found with this id!' });
    }

    res.status(200).json(catdata);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const catdata = await Category.create(req.body);
    res.status(200).json(catdata);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err });
  }
});

// Update a category by its `id`
router.put('/:id', async (req, res) => {
  try {
    const catdata = await Category.update(req.body, {
      where: { id: req.params.id },
    });

    if (!catdata[0]) {
      return res.status(404).json({ message: 'No category with this id!' });
    }

    res.status(200).json({ message: 'Category updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// Delete a category by its `id`
router.delete('/:id', async (req, res) => {
  try {
    const catdata = await Category.destroy({
      where: { id: req.params.id },
    });

    if (!catdata) {
      return res.status(404).json({ message: 'No category with this id!' });
    }

    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

module.exports = router;
