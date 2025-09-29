import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);