import mongoose from "mongoose";

const userLockerSchema = mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    lockerNumber : {
        type : Number,
        required : true
    },
    notes : {
        type : String,
        default : ""
    },

} , {timestamps : true})

const userLockerModel = mongoose.model("userLocker" , userLockerSchema)

export default userLockerModel