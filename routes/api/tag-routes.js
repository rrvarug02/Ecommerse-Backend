const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag, // Ensure the through table is included
        },
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// Get a single tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          through: ProductTag,
        },
      ],
    });

    if (!tagData) {
      return res.status(404).json({ message: 'No tag found with this id!' });
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err });
  }
});

// Update a tag by its ID
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!tagData[0]) {
      return res.status(404).json({ message: 'No tag found with this id!' });
    }

    res.status(200).json({ message: 'Tag updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// Delete a tag by its ID
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      return res.status(404).json({ message: 'No tag found with this id!' });
    }

    res.status(200).json({ message: 'Tag deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

module.exports = router;
