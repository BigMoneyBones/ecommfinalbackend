var express = require("express");
var router = express.Router();
const { bakeryDB } = require("../mongo");
const jwt = require('jsonwebtoken');
const { uuid } = require('uuidv4');
const dotenv = require('dotenv');
dotenv.config();


/* GET products page. */
router.post("/checkout-cart", async (req, res, next) => {
    try {

        /* 
            1. Get the user token from the headers (req.headers.token)
            2. Get the userId from the token by using JWT validate
            3. Get the current user by userId from mongo
            4. Create a new orderId using uuid
            5. Create a new order object with the currentCart (from req.body.cart) and the orderId
            6. Insert the new order into the orders collection
            7. Update the user to have currentOrderId: orderId
            8. Save user
        */
        const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.headers.token;

        const verifiedToken = jwt.verify(token, jwtSecretKey)
        const userData = verifiedToken.data
        const userId = userData.userId

        const userCollection = await bakeryDB().collection("users");
        const currentUser = await userCollection.findOne({ uid: userId })

        const orderId = uuid()
        const cart = req.body.cart
        const newOrder = {
            orderId,
            productList: cart
        }

        const ordersCollection = await bakeryDB().collection("orders");
        await ordersCollection.insertOne(newOrder)

        userCollection.updateOne({
            uid: userId
        }, {
            $set: {
                currentOrderId: orderId
            }
        })

        res.json({ success: true, message: "Created new order", newOrder, orderId });
    } catch (error) {
        console.log(error)
        res.status(500).send("error fetching products " + error);
    }
});

module.exports = router;
