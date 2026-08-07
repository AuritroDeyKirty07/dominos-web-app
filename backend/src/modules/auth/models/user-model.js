import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    address: [
      {
        label: String,
        street: String,
        city: String,
        pincode: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

export const userModel=mongoose.model("User",userSchema)