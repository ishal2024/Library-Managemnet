import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    status : false,
    allUsers : []
}

const usersSlicer = createSlice({
    name : "users",
    initialState,
    reducers : {
        addAllUsersData : (state , action) => {
            state.status = true
            state.allUsers = action.payload
        },
        refreshUsersData : (state , action) => {
            state.status = false
            state.allUsers = []
        }
    }
})

export const {addAllUsersData , refreshUsersData} = usersSlicer.actions

export default usersSlicer.reducer