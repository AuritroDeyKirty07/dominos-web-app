import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },

    customerName: {
      type: String,
      required: true
    },

    items: [
      {
        name: {
          type: String,
          required: true
        },

        quantity: {
          type: Number,
          required: true
        }
      }
    ],

    status: {
      type: String,
      enum: [
        "Placed",
        "Preparing",
        "Ready",
        "Out for Delivery",
        "Delivered"
      ],
      default: "Placed"
    }
  },

  {
    timestamps: true
  }
);


const Order = mongoose.model("Order", orderSchema);


export default Order;