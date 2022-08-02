var express = require("express");
var router = express.Router();

const { uuid } = require("uuidv4");

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
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

/* Get user list IF logged in user is an admin. */
router.get("/admin", (req, res, next) => {
  try {
    // if the user is an admin, generate the userList
    if (isAdmin === true) {
      res.status(200).json(userList);
    }
  } catch (error) {
    // if the user is not an admin, display error message.
    res.status(500).json({
      message: "Error, user does not have admin privileges" + error,
      success: false,
    });
  }
});

/*  */
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
