import userAttendanceModel from "../../Models/userAttendance.model.js"


async function checkOut(req,res){
    try {
        const {userId} = req?.params

        const attendance = await userAttendanceModel.findOne({
            userId,
            attendanceDate : new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
        })

        if(!attendance)
            return res.status(400).json({ status: false, message: "Not Checked-in", 
        description: "You doesnt checkedin for today , please checkin first, then checkout" })

        if(attendance?.checkOutTime)
            return res.status(400).json({ status: false, message: "Already Checked Out", 
        description: "You already checkout for today" })

        
        attendance.checkOutTime = new Date()
        await attendance.save()

        return res.status(200).json({ status: true,
             message: `Checked Out Successfully`, 
            description: `Checkout completed for ${attendance?.attendanceDate}` })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default checkOut