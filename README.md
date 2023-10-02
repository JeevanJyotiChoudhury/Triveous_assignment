# Triveous_assignment
# E-Commerce API with Node.js

This project is an example of an E-Commerce API built with Node.js, Express.js, and MongoDB. It provides various endpoints for managing products, categories, user authentication, shopping carts, and order placement. This README file serves as a guide on setting up, configuring, and using the API.

#### Environment Variables

Create a .env file in the root directory of the project to store environment-specific configuration variables.

# Sample .env file
PORT=anypreferale port
MONGODB_URL=your mongoDB url

## API Endpoints

### User Authentication

-> Register:- (POST) https://ill-erin-shark-slip.cyclic.cloud/users/register
-> Login:- (POST) https://ill-erin-shark-slip.cyclic.cloud/users/login
-> Logout:- (GET) https://ill-erin-shark-slip.cyclic.cloud/users/logout

### Categories

-> Create Category:- (POST) https://ill-erin-shark-slip.cyclic.cloud/product/add
-> List Categories:- (GET) https://ill-erin-shark-slip.cyclic.cloud/product/allcategories

### Products

-> Create Product By Category:- (POST) https://ill-erin-shark-slip.cyclic.cloud/products/addproduct/:categoryId
-> List Products by Category:- (GET) https://ill-erin-shark-slip.cyclic.cloud/products/byCategoryName/CategoryName
-> Product Details:- (GET) https://ill-erin-shark-slip.cyclic.cloud/products/details/:productId
-> List of all Products:- (GET) https://ill-erin-shark-slip.cyclic.cloud/products/allproducts

### Shopping Cart

-> Add to Cart:- (POST) https://ill-erin-shark-slip.cyclic.cloud/cart/add
-> View Cart:- (GET) https://ill-erin-shark-slip.cyclic.cloud/cart/view/:userId
-> Update Cart Item Quantity:- (PUT) https://ill-erin-shark-slip.cyclic.cloud/cart/update/:cartItemId
-> Remove Cart Item:- (DELETE) https://ill-erin-shark-slip.cyclic.cloud/cart/remove/:cartItemId
-> Total Quantity in Cart:- (GET) https://ill-erin-shark-slip.cyclic.cloud/cart/totalQuantity/:userId

### Order Management

-> Place Order:- (POST) https://ill-erin-shark-slip.cyclic.cloud/orders/placeOrder/:userId
-> Order History:- (GET) https://ill-erin-shark-slip.cyclic.cloud/orders/history/:userId
-> Order Details:- (GET) https://ill-erin-shark-slip.cyclic.cloud/orders/details/:orderId

## Rate Limiting

The API has rate limiting implemented to prevent abuse. By default, a client is limited to 10 requests per IP address within a 1-minute window. This rate limit can be adjusted as needed.