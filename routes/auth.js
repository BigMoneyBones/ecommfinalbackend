var express = require("express");
var router = express.Router();

// npm i bcryptjs uuidv4
// bcrypt gives us access to password generation and authentication funcionality for logging users in to our application.
const bcrypt = require("bcryptjs");
const { uuid } = require("uuidv4");
const { bakeryDB } = require("../mongo");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

/* 
* @param email {string}
* @param passwordHash {string}: encrypted password using bcrypt salt/hash
* @description: implement the user creation route using the bcrypt salt/hash functions to take our new users password and encrypt it before saving it to the database.
* @info: You do not have to create the users collection in mongodb before saving to it. Mongo will automatically create the users collection upon insert of a new document.
*
*/
const createUser = async (email, passwordHash) => {

  const collection = await bakeryDB().collection("users");

  // Create new user with input from registration page user input fields.
  const newUser = {
    userId: uuid(), // uid stands for User ID. This will be a unique string that we can use to identify our user.
    email: email,
    password: passwordHash,
    currentCart: [],
    orderHistory: [],
  };

  console.log("mongo response " + collection);
  try {
    // Save user functionality
    await collection.insertOne(newUser);
    return true;
  } catch (error) {
    console.log("something is wrong");
    console.error(error);
    return false;
  }
};

router.post("/products", async (req, res, next) => {
  const collection = await bakeryDB().collection("products");
  try {
    const products = await collection;
    res.json({ success: true, products }).status(200);
    return;
  } catch (error) {
    res
      .json({ message: "Error rendering products page.", success: false })
      .status(500);
  }
});

router.post("/registration", async (req, res, next) => {
  try {
    // from input fields
    const email = req.body.email;
    const password = req.body.password;

    const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const userSaveSuccess = await createUser(email, hash);

    console.log(userSaveSuccess);

    res
      .status(200)
      .json({ message: "New user added successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding new user" + error, success: false });
  }
});

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const collection = await bakeryDB().collection("users");

  try {
    const user = await collection.findOne({
      email: email,
    });

    if (!user) {
      res.json({ success: false }).status(204);
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const jwtSecretKey = process.env.JWT_SECRET_KEY;

      const data = {
        time: new Date(),
        userId: user.uid, // Note: Double check this line of code to be sure that user.uid is coming from your fetched mongo user
      };

      const token = jwt.sign(data, jwtSecretKey);
      res.json({ success: true, token }).status(200);
      return;
    }
    res.json({ success: false });
  } catch (error) {
    res.json({ message: "Error Logging In.", success: false }).status(500);
  }
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

router.get("/validate-token", async (req, res, next) => {
  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);

    if (verified) {
      return res.json({ success: true });
    } else {
      // Access Denied
      throw Error("Access Denied");
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ success: error, message: String(error) });
  }
});

module.exports = router;
