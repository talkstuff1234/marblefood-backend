const express = require("express");
const router = express.Router();
const Product = require("../product");
const formatResponse = require("../formatResponse");

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().exec();
    res.json(formatResponse(200, "Products fetched Succesfully", products));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Add a new product
router.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json(formatResponse(200, "Product added successfully", savedProduct));
  } catch (err) {
    res.status(400).json(formatResponse(400, "Failed to add product", null));
  }
});

// Get a product by productCode
router.get("/products/:productCode", async (req, res) => {
  const productCode = req.params.productCode;

  try {
    // Calculate the productName from the productCode
    const productName = productCode.replace(/-/g, " ").toLowerCase();

    // Find the product by productName and compare case-insensitively
    const product = await Product.findOne({
      productName: { $regex: new RegExp(`^${productName}$`, "i") },
    });

    if (!product) {
      return res
        .status(404)
        .json(formatResponse(404, "Product not found", null));
    }
    res.json(formatResponse(200, "Product fetched successfully", product));
  } catch (err) {
    console.error(err);
    res.status(500).json(formatResponse(500, "Internal Server Error", null));
  }
});

// Update a product by productCode
router.put("/products/code/:productCode", async (req, res) => {
  const productCode = req.params.productCode;

  try {
    // Convert productCode to productName format
    const productName = productCode.replace(/-/g, " ").toLowerCase();

    // Find and update product by productName (case-insensitive)
    const updatedProduct = await Product.findOneAndUpdate(
      { productName: { $regex: new RegExp(`^${productName}$`, "i") } },
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json(formatResponse(404, "Product not found", null));
    }
    res.json(
      formatResponse(200, "Product updated successfully", updatedProduct)
    );
  } catch (err) {
    console.error(err);
    res.status(400).json(formatResponse(400, "Failed to update product", null));
  }
});


// Delete a product by ID
router.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json(formatResponse(404, "Product not found", null));
    }
    res.json(
      formatResponse(200, "Product deleted successfully", deletedProduct)
    );
  } catch (err) {
    res.status(500).json(formatResponse(500, "Failed to delete product", null));
  }
});

// Update a product by ID
router.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json(formatResponse(404, "Product not found", null));
    }
    res.json(
      formatResponse(200, "Product updated successfully", updatedProduct)
    );
  } catch (err) {
    res.status(400).json(formatResponse(400, "Failed to update product", null));
  }
});

// Add a review to a product
router.post("/products/:id/reviews", async (req, res) => {
  try {
    const { reviewRating } = req.body;

    // Check if the rating is within the allowed range
    if (reviewRating < 1 || reviewRating > 5) {
      return res
        .status(400)
        .json(
          formatResponse(400, "Review rating must be between 1 and 5", null)
        );
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json(formatResponse(404, "Product not found", null));
    }

    product.productReviews.push(req.body);
    await product.save();

    res
      .status(201)
      .json(formatResponse(201, "Review added successfully", product));
  } catch (err) {
    console.error(err);
    res.status(400).json(formatResponse(400, `${err}`, null));
  }
});

// Delete a review from a product
router.delete("/products/:id/reviews/:reviewId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json(formatResponse(404, "Product not found", null));
    }

    // Find the index of the review with the given reviewId
    const reviewIndex = product.productReviews.findIndex(
      (review) => review._id.toString() === req.params.reviewId
    );

    // If the review is found, remove it
    if (reviewIndex !== -1) {
      product.productReviews.splice(reviewIndex, 1);
      await product.save();
      res.json(formatResponse(200, "Review deleted successfully", product));
    } else {
      return res
        .status(404)
        .json(formatResponse(404, "Review not found", null));
    }
  } catch (err) {
    res
      .status(400)
      .json(
        formatResponse(400, "Failed to delete review", { fullError: `${err}` })
      );
  }
});

// Get related products (returns name, image URL, and ID)
router.get("/related-products", async (req, res) => {
  try {
    const products = await Product.find({}, "productName productImageUrl _id");
    res.json(
      formatResponse(200, "Related products fetched successfully", products)
    );
  } catch (err) {
    res
      .status(500)
      .json(formatResponse(500, "Failed to get related products", null));
  }
});

router.get("/navbar-products", async (req, res) => {
  try {
    const products = await Product.find(
      {},
      "productName productIcon productShortDescription _id"
    );
    res.json(
      formatResponse(200, "Related products fetched successfully", products)
    );
  } catch (err) {
    res
      .status(500)
      .json(formatResponse(500, "Failed to get related products", null));
  }
});

module.exports = router;
