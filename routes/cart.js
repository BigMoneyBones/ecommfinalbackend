var express = require("express");
var router = express.Router();
const { bakeryDB } = require("../mongo");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const dotenv = require("dotenv");
dotenv.config();

/* GET cart page. */
router.post("/checkout-cart", async (req, res, next) => {
  try {
    //Variables for token and JWT
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    // 1. Get the user token from the headers
    const token = req.headers.token;

    console.log("token ", token);
    // 2. Get the userId from the token by using JWT validate
    const verifiedToken = jwt.verify(token, jwtSecretKey);
    const userData = verifiedToken.data;
    console.log("userData ", userData);
    const userId = userData.userId;

    console.log("userId ", userId);

    // 3. Get the current user by userId from mongo
    const userCollection = await bakeryDB().collection("users");
    const currentUser = await userCollection.findOne({ userId });

    // 4. Create a new orderId using uuid
    const orderId = uuid();
    const cart = req.body.cart;
    const today = new Date();

    // 5. Create a new order object with the currentCart(from req.body.cart) and the orderId
    const newOrder = {
      orderId,
      productList: cart,
      createdAt: today,
      lastModified: today,
      status: "open",
    };

    // 6. Insert the new order into the orders collection
    const ordersCollection = await bakeryDB().collection("orders");
    await ordersCollection.insertOne(newOrder);

    // 7. Update the user to have currentOrderId: orderId
    // 8. Save user
    userCollection.updateOne(
      {
        userId: userId,
      },
      {
        $set: {
          currentOrderId: orderId,
        },
        $addToSet: {
          orderHistory: orderId,
        },
      }
    );
    res.json({
      success: true,
      message: "Created new order",
      newOrder,
      orderId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("error fetching products " + error);
  }
});

module.exports = router;
