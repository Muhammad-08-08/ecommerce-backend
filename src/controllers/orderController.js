import express from "express";
import Order from "../models/Order.js";

const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - amount
 *               - address
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 60c72b2f9b1d8e6f88f0c9b1
 *                     quantity:
 *                       type: number
 *                       example: 2
 *               amount:
 *                 type: number
 *                 example: 59.98
 *               address:
 *                 type: object
 *                 example: { street: "123 Main St", city: "Anytown", zip: "12345", country: "USA" }
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request
 */
orderRouter.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: "Bad request" });
  }
});

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Get orders for a specific user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orders not found
 */
orderRouter.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Orders not found" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default orderRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - products
 *         - amount
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         userId:
 *           type: string
 *           description: The ID of the user who placed the order
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product ordered
 *         amount:
 *           type: number
 *           description: Total amount of the order
 *         address:
 *           type: object
 *           description: Shipping address for the order
 *         status:
 *           type: string
 *           description: Status of the order (e.g., pending, shipped, delivered)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the order was last updated
 *       example:
 *         id: 60c72b2f9b1d8e6f88f0c9b1
 *         userId: 60c72b2f9b1d8e6f88f0c9b0
 *         products:
 *           - productId: 60c72b2f9b1d8e6f88f0c9b1
 *             quantity: 2
 *           - productId: 60c72b2f9b1d8e6f88f0c9b2
 *             quantity: 1
 *         amount: 59.98
 *         address: { street: "123 Main St", city: "Anytown", zip: "12345", country: "USA" }
 *         status: pending
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */
