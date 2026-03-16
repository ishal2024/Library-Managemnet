
import userModel from "../../Models/user.model.js"
import userLockerModel from "../../Models/userLocker.model.js";



async function deAllocateUserLocker(req, res) {
    try {
        const { user , lockerId } = req?.body

        if(!user?.lockerId)
            return res.status(400).json({ status: false, description: "User doesn't allocated any locker ", message: "Locker not found" });
        
        if(!String(user?.lockerId?._id) === String(lockerId))
            return res.status(400).json({ status: false, description: "This locker is already alloted someone", message: "Invalid Locker" });
        

        const deletedLocker = await userLockerModel.findOneAndDelete({
            _id : lockerId
        })

        if (!deletedLocker) {
            return res.status(400).json({ status: false, description: "Please enter correct locker number ", message: "Locker not found" });
        }

        const updatedUser = await userModel.findOneAndUpdate({ _id: user?._id }, { $set: { lockerId: null } } , {new : true})

        return res.status(200).json({
            status: true, data: {
                user : updatedUser,
            }, message: `Deallocation Locker completed`,
            description: `This Locker is deallocated from user`
        })


    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default deAllocateUserLocker