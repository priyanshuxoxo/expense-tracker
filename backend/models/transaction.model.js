import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["savings", "expense", "investment"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Unknown",
    },
    paymentType: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
