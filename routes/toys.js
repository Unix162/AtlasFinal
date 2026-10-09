const express = require("express");
const { ToyModel, validateToy } = require("../models/toyModel");
const { auth } = require("../middlewares/auth");

const router = express.Router();


router.get("/", async (req, res) => {
  const limit = 10;
  const skip = req.query.skip || 0;
  const category = req.query.category;
  const filterFind = {};

  if (category) {
    filterFind.category = category;
  }

  try {
    const data = await ToyModel
      .find(filterFind)
      .limit(limit)
      .skip(skip);

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.get("/search", async (req, res) => {
  const limit = 10;
  const skip = req.query.skip || 0;

  try {
    const search = req.query.s;

    if (!search) {
      return res.status(400).json({ msg: "Please enter search query" });
    }

    const searchExp = new RegExp(search, "i");
    const data = await ToyModel
      .find({
        $or: [
          { name: searchExp },
          { info: searchExp }
        ]
      })
      .limit(limit)
      .skip(skip);

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/category/:catname", async (req, res) => {
  const limit = 10;
  const skip = req.query.skip || 0;

  try {
    const catname = req.params.catname;
    const data = await ToyModel
      .find({ category: catname })
      .limit(limit)
      .skip(skip);

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.get("/prices", async (req, res) => {
  const limit = 10;
  const skip = req.query.skip || 0;
  const min = req.query.min;
  const max = req.query.max;
  const filterFind = {};

  if (min !== undefined && min !== "") {
    filterFind.price = { $gte: Number(min) };
  }

  if (max !== undefined && max !== "") {
    if (filterFind.price) {
      filterFind.price.$lte = Number(max);
    }
    else {
      filterFind.price = { $lte: Number(max) };
    }
  }

  try {
    const data = await ToyModel
      .find(filterFind)
      .limit(limit)
      .skip(skip);

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.get("/count", async (req, res) => {
  try {
    const count = await ToyModel.countDocuments({});
    res.json({ count });
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ToyModel.findOne({ _id: id });

    if (!data) {
      return res.status(404).json({ msg: "Toy not found" });
    }

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.post("/", auth, async (req, res) => {
  const validBody = validateToy(req.body);

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    const toy = new ToyModel(req.body);

    toy.user_id = req.tokenData._id;

    await toy.save();

    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.put("/:id", auth, async (req, res) => {
  const validBody = validateToy(req.body);

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    const id = req.params.id;
    const data = await ToyModel.updateOne(
      { _id: id, user_id: req.tokenData._id },
      req.body
    );

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ToyModel.deleteOne({
      _id: id,
      user_id: req.tokenData._id
    });

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


module.exports = router;