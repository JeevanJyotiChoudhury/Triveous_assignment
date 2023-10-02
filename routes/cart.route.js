const express = require("express");
const CartItem = require("../models/cart.model");
const { auth } = require("../middleware/auth.middleware");
const cartRouter = express.Router();

cartRouter.use(auth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: It is related to the who has signed up and added the item to the cart
 *         product:
 *           type: string
 *           description: The product which has been added to the cart
 *         quantity:
 *           type: integer
 *           description: The count of product that has been added to the cart
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: All the API routes related to cart and items present in it
 */

/**
 * @swagger
 * securityDefinitions:
 *   BearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

/**
 * @swagger
 * /cart/totalQuantity/{userId}:
 *   get:
 *     summary: Get the total quantity of items in the user's cart
 *     tags: [Cart]
 *     parameters:
 *         name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Total quantity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalQuantity:
 *                   type: integer
 *                   description: The total quantity of items in the user's cart
 *       400:
 *         description: Failed to get the data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cart"
 */

cartRouter.get("/totalQuantity/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const cartItems = await CartItem.find({ user: userId });
    const totalQuantity = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    res.status(200).json({ totalQuantity });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add an item to the user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CartItemRequest"
 *     responses:
 *       200:
 *         description: Item added to the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cart"
 *       400:
 *         description: Failed to add the item to the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cart"
 */

// Route to add product to user's cart
cartRouter.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cartItem = await CartItem.findOne({ user: userId, product: productId });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new CartItem({ user: userId, product: productId, quantity });
    }
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /cart/view/{userId}:
 *   get:
 *     summary: View items in the user's cart
 *     tags: [Cart]
 *     parameters:
 *         name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Cart"
 *       400:
 *         description: Failed to fetch the cart data of user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cart"
 */

// Route to view the user's cart
cartRouter.get("/view/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const cartItems = await CartItem.find({ user: userId }).populate(
      "product",
      "title price availability"
    );
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /cart/update/{cartItemId}:
 *   put:
 *     summary: Update the quantity of a product in the user's cart
 *     tags: [Cart]
 *     parameters:
 *         name: cartItemId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the cart item to be updated
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Cart"
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cart"
 *       404:
 *         description: Bad request, cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cart"
 */

// Route to update the quantity of an item in the cart
cartRouter.put("/update/:cartItemId", async (req, res) => {
  const cartItemId = req.params.cartItemId;
  const { quantity } = req.body;

  try {
    const cartItem = await CartItem.findByIdAndUpdate(
      cartItemId,
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /cart/remove/{cartItemId}:
 *   delete:
 *     summary: Remove a product from the user's cart
 *     tags: [Cart]
 *     parameters:
 *         name: cartItemId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the cart item to be removed
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/cart"
 */

// Route to remove an item from the cart
cartRouter.delete("/remove/:cartItemId", async (req, res) => {
  const cartItemId = req.params.cartItemId;

  try {
    const cartItem = await CartItem.findByIdAndRemove(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { cartRouter };
