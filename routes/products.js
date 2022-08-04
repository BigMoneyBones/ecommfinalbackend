var express = require("express");
const { bakeryDB } = require("../mongo");
var router = express.Router();

/* GET products page. */
router.get("/all", async (req, res, next) => {
  try {
    const collection = await bakeryDB().collection("products");
    const limit = Number(req.query.limit);
    const skip = Number(req.query.limit) * (Number(req.query.page) - 1);
    const sortField = req.query.sortField;
    // if sort field is equal to "ASC", then sequential (1), if not, sequential in reverse order (-1).
    const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
    const filterField = req.query.filterField;
    const filterValue = req.query.filterValue;

    let filterObj = {};
    if (filterField && filterValue) {
      filterObj = { [filterField]: filterValue };
    }
    let sortObj = {};
    if (sortField && sortOrder) {
      sortObj = { [sortField]: sortOrder };
    }

    const products = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();
    res.json({ message: products });
  } catch (error) {
    res.status(500).send("error fetching posts " + error);
  }
});

module.exports = router;
