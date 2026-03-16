import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    status : false,
    dashboardData : []
}

const dashboardSlicer = createSlice({
    name : "dashboard",
    initialState,
    reducers : {
        addDashboardData : (state , action) => {
            state.status = true
            state.dashboardData = action.payload
        }
    }
})

export const {addDashboardData} = dashboardSlicer.actions

export default dashboardSlicer.reducer