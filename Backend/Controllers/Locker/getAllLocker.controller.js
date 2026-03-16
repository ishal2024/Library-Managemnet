import userLockerModel from "../../Models/userLocker.model.js"


async function getAllLockers(req, res) {
    try {
        const allLockers = await userLockerModel.find({}).populate("userId")

        let lockers = []
        let occupiedLockers = 0
        for (let i = 25; i <= 48; i++) {
            let locker = {
                id: i,
                lockerNumber: i,
                status: "Available"
            }
            const userExist = allLockers.find((l) => l.lockerNumber == i)
            if (userExist) {
                locker = { ...locker, status: "Occupied", userDetail: userExist?.userId , locker : userExist }
                occupiedLockers++       
            }
            lockers = [...lockers, locker]
        }

        return res.status(200).json({
            status: true,
            data: {
                lockers,
                totalLocker : 24,
                occupiedLockers : occupiedLockers ,
                unOccupiedLockers : 42-occupiedLockers

            }, message: `List of all the seats`,
            description: `List of all the seats`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getAllLockers