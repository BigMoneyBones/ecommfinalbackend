var express = require("express");
var router = express.Router();

// Initial user list to be added to with registration functionality.
const userList = [
  {
    userId: uuid(),
    email: "johnsmith@gmail.com",
    password: "john",
    currentOrder: [], // Empty
    orderHistory: [], // Empty
  },
  {
    userId: uuid(),
    email: "sallysmith@gmail.com",
    password: "sally",
    currentOrder: [], // Empty
    orderHistory: [], // Empty
  },
];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/registration", (req, res, next) => {
  try {
    // from input fields
    const email = req.body.email;
    const password = req.body.password;

    // Create new user with input from registration page user input fields.
    const newUser = {
      userId: uuid(),
      email: email,
      password: password,
      currentCart: [],
      orderHistory: [],
    };

    userList.push(newUser);

    res
      .status(200)
      .json({ message: "New user added successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding new user" + error, success: false });
  }
});

module.exports = router;