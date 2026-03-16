import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allLockerData: {
        lockers: [],
        totalLockers: 24,
        occupiedLockers : 0,
        unOccupiedLockers: 24
    }
}

const lockerSlicer = createSlice({
    name: "locker",
    initialState,
    reducers: {
        addAllLockerData: (state, actions) => {
            state.allLockerData = actions.payload
        }
    }
})

export const { addAllLockerData } = lockerSlicer.actions

export default lockerSlicer.reducer