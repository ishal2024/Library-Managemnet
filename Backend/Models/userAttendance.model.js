import mongoose from "mongoose";

const userAttendanceSchema = mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    checkInTime : {
        type : Date,
        required : true
    },
    seatNumber : {
        type : Number,
        required : true
    },

    checkOutTime : {
        type : Date,
        default : null
    },
    attendanceDate : {
         type : String,
         default : new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
    }
} , {timestamps : true})

const userAttendanceModel = mongoose.model("userAttendance" , userAttendanceSchema)

export default userAttendanceModel