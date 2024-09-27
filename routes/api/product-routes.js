const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  try {
    const prodData = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }, // Ensure Tag is through ProductTag
      ],
    });
    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// Get one product by ID
router.get('/:id', async (req, res) => {
  try {
    const prodData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });

    if (!prodData) {
      return res.status(404).json({ message: 'No product found with this id!' });
    }

    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;
    const product = await Product.create({ product_name, price, stock });

    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (tagIds && tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Bad request', error: err });
  }
});

// Update product by ID
router.put('/:id', async (req, res) => {
  try {
    // Update product data
    await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      // Find all associated tags from ProductTag
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

      // Get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      // Create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      // Figure out which tags to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // Run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    res.status(200).json({ message: 'Product updated successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const prodData = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!prodData) {
      return res.status(404).json({ message: 'No product found with this id!' });
    }

    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

module.exports = router;
