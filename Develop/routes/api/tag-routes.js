const router = require("express").Router();
const { models } = require("../../models");
// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    const tags = await models.Tag.findAll({
      include: [{ model: models.Product }],
    });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tag = await models.Tag.findByPk(req.params.id, {
      include: [{ model: models.Product }],
    });
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const tag = await models.Tag.create(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tag = await models.Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    tag.tag_name = req.body.tag_name;
    await tag.save();
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tag = await models.Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    await tag.destroy();
    res.status(200).json({ message: "Tag successfully deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
