const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ProductModel = require("../models/product.model");
const CategoryModel = require("../models/category.model");
const productRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: This is the auto-generated ID for the product
 *         title:
 *           type: string
 *           description: The product title
 *         description:
 *           type: string
 *           description: The product description
 *         price:
 *           type: integer
 *           description: The price of the product
 *         availability:
 *           type: boolean
 *           description: Indicates if the product is available or not
 *         category:
 *           type: string
 *           description: Shows to which category this product belongs to
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: All the API routes related to products
 */

/**
 * @swagger
 * /products/addproduct/{categoryId}:
 *   post:
 *     summary: Add a new product to a category
 *     tags: [Products]
 *     parameters:
 *         name: categoryId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the category to which the product belongs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       200:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Some error occured while adding a product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */

productRouter.post("/addproduct/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  const { title, description, price, availability } = req.body;
  try {
    const product = new ProductModel({
      title,
      description,
      price,
      availability,
      category: categoryId,
    });
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/details/{productId}:
 *   get:
 *     summary: Get details of a product by ID
 *     tags: [Products]
 *     parameters:
 *         name: productId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the product to retrieve details
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */

productRouter.get("/details/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await ProductModel.findById(productId).populate(
      "category",
      "name"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/allproducts:
 *   get:
 *     summary: Get details of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 *       400:
 *         description: Failed to retrive the products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */

productRouter.get("/allproducts", async (req, res) => {
  try {
    const products = await ProductModel.find()
      .select("title price description availability")
      .populate("category", "name -_id");
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/byCategoryName/{categoryName}:
 *   get:
 *     summary: Get products by category name
 *     tags: [Products]
 *     parameters:
 *         name: categoryName
 *         in: path
 *         required: true
 *         type: string
 *         description: The name of the category to retrieve products
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */

productRouter.get("/byCategoryName/:categoryName", async (req, res) => {
  const categoryName = req.params.categoryName;
  try {
    const category = await CategoryModel.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const products = await ProductModel.find({ category: category._id }).select(
      "title price description availability"
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { productRouter };
