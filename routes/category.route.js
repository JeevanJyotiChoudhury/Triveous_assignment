const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CategoryModel = require("../models/category.model");

const categoryRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: This is the auto-generated ID for each new category
 *         name:
 *           type: string
 *           description: The name of the category
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: All the API routes related to category
 */

/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: Add a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Category"
 *     responses:
 *       200:
 *         description: New category has been added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating the success
 *                 newCategory:
 *                   $ref: "#/components/schemas/Category"
 *       400:
 *         description: Failed to add category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 */

// Route to add a new category
categoryRouter.post("/add", async (req, res) => {
  const { name } = req.body;
  try {
    const category = new CategoryModel({ name });
    await category.save();
    res
      .status(200)
      .json({ msg: "New category has been added", newCategory: category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /product/allcategories:
 *   get:
 *     summary: Get details of all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Category"
 *       400:
 *         description: Cannot get the categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 */

// Route to get all the categories
categoryRouter.get("/allcategories", async (req, res) => {
  try {
    const products = await CategoryModel.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { categoryRouter };
