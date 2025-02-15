const mongoose = require("mongoose");

// Define the productPricingSchema first
const productPricingSchema = new mongoose.Schema({
  pricingDetails: { type: String, default: "" },
  pricingType: { type: String, default: "" },
  pricingOutTurn: { type: String, default: "" },
  pricingCount: { type: String, default: "" },
  pricingMoisture: { type: String, default: "" },
  pricingDefective: { type: String, default: "" },
});

const reviewSchema = new mongoose.Schema({
  reviewName: String,
  reviewEmail: String,
  reviewComments: String,
  reviewRating: { type: Number, min: 1, max: 5 },
});

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productShortDescription: String,
  productFullDescription: String,
  productDescription: String, // Added this field
  productImageUrl: String,
  productIcon: String,
  productReviewImageUrl: String,
  productReviews: [reviewSchema],
  productPricing: productPricingSchema,
});

productSchema.virtual("productCode").get(function () {
  return this.productName.toLowerCase().replace(/\s+/g, "-");
});

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id; // rename _id to id
    delete ret._id; // remove _id
    delete ret.__v; // remove __v
    ret.productCode = doc.productCode; // add productCode to the JSON output
    return ret;
  },
});

reviewSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id; // rename _id to id
    delete ret._id; // remove _id
    delete ret.__v; // remove __v
    return ret;
  },
});

productPricingSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id; // rename _id to id
    delete ret._id; // remove _id
    delete ret.__v; // remove __v
    return ret;
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
