import mongoose from "mongoose";

const userSeatSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    seatNumber: {
        type: Number,
        required: true,
        unique : true
    },
    notes : {
        type : String,
        default : ""
    },

}, { timestamps: true })

const userSeatModel = mongoose.model("userSeat", userSeatSchema)

export default userSeatModel