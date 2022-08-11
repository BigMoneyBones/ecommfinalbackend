var express = require("express");
const { bakeryDB } = require("../mongo");
var router = express.Router();

/* GET products page. */
router.get("/cart", async (req, res, next) => {
    try {
        // need to get current user from DB
        // const currentUser = 

        // need to get currentCart from current user in DB
        const collection = await bakeryDB().collection("users.currentCart"); //this will need to be changed to get the current user's cart array
        const cartProducts = await collection
            .toArray();

        res.json({ message: cartProducts });
    } catch (error) {
        res.status(500).send("error fetching products " + error);
    }
});

module.exports = router;
