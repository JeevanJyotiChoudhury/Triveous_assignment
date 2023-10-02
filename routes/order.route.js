const express = require("express");
const Order = require("../models/order.model");
const CartItem = require("../models/cart.model");
const { auth } = require("../middleware/auth.middleware");
const orderRouter = express.Router();

orderRouter.use(auth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The user who has placed the order
 *         products:
 *           type: object
 *           properties:
 *            product:
 *              type: string
 *              description: The product whose order has been placed
 *            quantity:
 *              type: integer
 *              description: The number of products that has been placed for order
 *
 */

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: All the API routes related to order placed of items
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
 * /orders/placeOrder/{userId}:
 *   post:
 *     summary: Place an order for items in the user's cart
 *     tags: [Order]
 *     parameters:
 *         name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user placing the order
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 *       400:
 *         description: Bad request, cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 */

// Route to place an order
orderRouter.post("/placeOrder/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const cartItems = await CartItem.find({ user: userId }).populate("product");
    if (!cartItems.length) {
      return res.status(400).json({
        error:
          "Cart is empty. Add products to your cart before placing an order.",
      });
    }
    const order = new Order({
      user: userId,
      products: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
      })),
    });
    await order.save();
    await CartItem.deleteMany({ user: userId });
    res.status(200).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDetails:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the order
 *         user:
 *           type: string
 *           description: The ID of the user who placed the order
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the product in the order
 *                   title:
 *                     type: string
 *                     description: The title of the product
 *                   price:
 *                     type: number
 *                     description: The price of the product
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product in the order
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was placed
 */

/**
 * @swagger
 * /orders/history/{userId}:
 *   get:
 *     summary: Get the order history of a user
 *     tags: [Order]
 *     parameters:
 *         name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user whose order history is to be retrieved
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/OrderDetails"
 *       400:
 *         description: Failed to retrive the order history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderDetails"
 */

// Route to get order history for a user
orderRouter.get("/history/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await Order.find({ user: userId })
      .populate("products.product", "title price")
      .sort({ orderDate: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /orders/details/{orderId}:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [Order]
 *     parameters:
 *         name: orderId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the order to get details for
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderDetails"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderDetails"
 */

// Route to get order details by ID
orderRouter.get("/details/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId).populate(
      "products.product",
      "title price"
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { orderRouter };
