var express = require("express");
var router = express.Router();
const { bakeryDB } = require("../mongo");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const dotenv = require("dotenv");
dotenv.config();

router.get("/user", async (req, res, next) => {
  try {
    //Variables for token and JWT
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    // 1. Get the user token from the headers
    const token = req.headers.token;

    // console.log("token ", token);
    // 2. Get the userId from the token by using JWT validate
    const verifiedToken = jwt.verify(token, jwtSecretKey);
    const userData = verifiedToken.data;
    // console.log("userData ", userData);
    const userId = userData.userId;

    // console.log("userId ", userId);

    // 3. Get the current user by userId from mongo
    const userCollection = await bakeryDB().collection("users");
    const currentUser = await userCollection.findOne({ userId });

    // 4. Get the current users order history by userId from mongo
    const currentUserOrderIds = currentUser.orderHistory;

    const orderCollection = await bakeryDB().collection("orders");
    const userOrders = await orderCollection
      .find({
        orderId: {
          $in: currentUserOrderIds,
        },
      })
      .toArray();

    currentUser.orderHistory = userOrders;
    //JN: This line is OVERWRITING the orderHistory key/value pair on the current user to replace the list of orderId's with the actual orders fetched from the database.

    res.json({
      success: true,
      message: "Successfully grabbed order history",
      currentUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching order history" });
  }
});

module.exports = router;
