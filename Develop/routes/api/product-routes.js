const router = require("express").Router();
const { models } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    const products = await models.Product.findAll({
      include: [
        { model: models.Category },
        { model: models.Tag, through: models.ProductTag },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id, {
      include: [
        { model: models.Category },
        { model: models.Tag, through: models.ProductTag },
      ],
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  models.Product.create(req.body)
    .then((product) => {
      // if there are product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return models.ProductTag.bulkCreate(productTagIdArr)
          .then(() => {
            res.status(201).json(product);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
      } else {
        // if no product tags, just respond
        res.status(201).json(product);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", async (req, res) => {
  try {
    // Update product data
    await models.Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // Find all associated tags from ProductTag
    const productTags = await models.ProductTag.findAll({
      where: { product_id: req.params.id },
    });

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

    // Figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // Run both actions
    await Promise.all([
      models.ProductTag.destroy({ where: { id: productTagsToRemove } }),
      models.ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await models.Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
