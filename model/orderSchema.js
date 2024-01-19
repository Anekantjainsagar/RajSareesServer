const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payments" },
  products: Array,
  amount: Number,
  status: {
    type: String,
    default: "PaymentFailed",
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;
