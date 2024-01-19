const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Orders" },
  amount: {
    type: Number,
    default: 0,
    require: true,
  },
  method: {
    type: String,
    default: "Card",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Payments = mongoose.model("Payments", paymentSchema);
module.exports = Payments;
