import mongoose from "mongoose";

const userPaymentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    paymentMethod: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },

    lockerId: {
        type: mongoose.Types.ObjectId,
        ref: "userLocker",
        default: null
    },

    seatId: {
        type: mongoose.Types.ObjectId,
        ref: "userSeat",
        default: null
    },

    paymentYear: {
        type: Number,
        default: Number(new Date().toISOString().split("T")[0].split("-")[0])
    },

    paymentMonth: {
        type: Number,
        default: Number(new Date().toISOString().split("T")[0].split("-")[1])
    },

    paymentDate: {
        type: String,
        default: new Date().toISOString().split("T")[0]
    },
    paymentStartDate: {
        type: Date,
        required: true
    },

    paymentEndDate: {
        type: Date,
        required: true
    },

}, { timestamps: true })

const userPaymentModel = mongoose.model("userPayment", userPaymentSchema)

export default userPaymentModel