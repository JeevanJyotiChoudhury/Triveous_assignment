const express = require("express");
require("dotenv").config();
const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");
const { categoryRouter } = require("./routes/category.route");
const { productRouter } = require("./routes/product.route");
const { cartRouter } = require("./routes/cart.route");
const { orderRouter } = require("./routes/order.route");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  time: 1 * 60 * 1000,
  max: 10,
});

const app = express();
app.use(express.json());
app.use(rateLimiter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const apiSpec = swaggerJSdoc(options);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(apiSpec));

app.use("/users", userRouter);
app.use("/product", categoryRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Server running at port 8080");
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
    console.log("Something went wrong");
  }
});
