const mongoose = require("mongoose");
const Listing=require("./listing");
const User=require("./user");
const bookingSchema = new mongoose.Schema({

  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  checkIn: {
    type: Date,
    required: true
  },

  checkOut: {
    type: Date,
    required: true
  },

  totalPrice: {
    type: Number,
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  paymentId: String

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
