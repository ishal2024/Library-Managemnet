import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    contact: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum : ["Male" , "Female" , "Other"],
      required: true,
    },

    dob: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },

    seatType: {
      type: String,
      enum: ["Random" , "Fixed"],
      required: true,
      default : "Random"
    },

    seatId : {
      type : mongoose.Types.ObjectId,
      ref : "userSeat",
      default : null
    },

    lockerId : {
      type : mongoose.Types.ObjectId,
      ref : "userLocker",
      default : null
    },

    paymentId : {
      type : mongoose.Types.ObjectId,
      ref : "userPayment",
    },

  }, {timestamps: true}
);

const userModel = mongoose.model("User", userSchema);

export default userModel;