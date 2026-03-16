import { configureStore } from "@reduxjs/toolkit";
import seatReducer from './seatSlicer'
import usersReducer from './usersSlicer'
import lockerReducer from './lockerSlicer'
import dashboardReducer from './dashboardSlicer'

const store = configureStore({
    reducer : {
        seat : seatReducer,
        users : usersReducer,
        locker : lockerReducer,
        dashboard : dashboardReducer 
    }
})

export default store