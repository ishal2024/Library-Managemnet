import userSeatModel from "../../Models/userSeat.model.js"



async function getAllSeats(req, res) {
    try {
        const allSeats = await userSeatModel.find({}).populate({path : "userId" , populate : {path : "seatId"}})

        let seats = []
        let occupiedSeats = 0
        for (let i = 1; i <= 42; i++) {
            let seat = {
                id: i,
                seatNumber: i,
                status: "Available"
            }
            const userExist = allSeats.find((s) => s.seatNumber == i)
            if (userExist) {
                seat = { ...seat, status: "Occupied", userDetail: userExist?.userId , seat : userExist }
                occupiedSeats++       
            }
            seats = [...seats, seat]
        }

        return res.status(200).json({
            status: true,
            data: {
                seats,
                totalSeats : 42,
                occupiedSeats : occupiedSeats ,
                unOccupiedSeats : 42-occupiedSeats

            }, message: `List of all the seats`,
            description: `List of all the seats`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getAllSeats