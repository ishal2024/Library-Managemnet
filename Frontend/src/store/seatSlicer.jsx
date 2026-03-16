import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allSeatsData: {
        seats: [],
        totalSeats: 42,
        occupiedSeats : 0,
        unOccupiedSeats: 42
    }
}

const seatSlicer = createSlice({
    name: "seat",
    initialState,
    reducers: {
        addAllSeatsData: (state, actions) => {
            state.allSeatsData = actions.payload
        }
    }
})

export const { addAllSeatsData } = seatSlicer.actions

export default seatSlicer.reducer