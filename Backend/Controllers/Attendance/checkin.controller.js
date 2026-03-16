import userAttendanceModel from "../../Models/userAttendance.model.js"


async function checkIn(req,res){
    try {
        const {user , seatNumber} = req?.body

        if(!user  || !seatNumber)
            return res.status(400).json({ status: false, message: "Data not Provided", 
        description: "Please provide data to check in" })

        const attendanceExist = await userAttendanceModel.findOne({
            userId : user?._id,
            attendanceDate : new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
        })

        if(attendanceExist)
            return res.status(400).json({ status: false, message: "Already checkin", 
        description: "You already checkin in library , please checkout first to again checkin" })

        const createdAttendance = await userAttendanceModel.create({
            userId : user?._id,
            seatNumber : req?.body?.seatNumber,
            checkInTime : new Date()
        })

        return res.status(200).json({ status: true, data : createdAttendance ,
             message: `Checked In Successfully`, 
            description: `Checkin completed for ${createdAttendance?.attendanceDate}` })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default checkIn