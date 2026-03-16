import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LibraryDashboard from "../Components/Dashboard";
import UsersPage from "../Components/UsersPage";
import LockerManagementPage from "../Components/Allocation/Locker/LockerManagementPage";
import SeatManagementPage from "../Components/Allocation/Seat/SeatManagementPage";
import AttendancePage from "../Components/Attendance/AttendancePage";
import LiveSeatMatrixPage from "../Components/LiveSeatMatrix/LiveSeatMatrixPage";
import PaymentPage from "../Components/Payment/PaymentPage";
import DailyAttendancePage from "../Components/DailyAttendancePage";
import UserDetailPage from "../Components/UserDetail/UserDetailPage";


export const router = createBrowserRouter([
    {
        path : '/',
        element : <App />,
        children : [
            {path : '' , element : <LibraryDashboard />},
            {path : 'users' , element : <UsersPage />},
            {path : 'locker' , element : <LockerManagementPage />},
            {path : 'seat' , element : <SeatManagementPage />},
            {path : 'seat-matrix' , element : <LiveSeatMatrixPage />},
            {path : 'payment' , element : <PaymentPage />},
            {path : 'daily-attendance' , element : <DailyAttendancePage />},
            {path : 'user' , element : <UserDetailPage />}
        ]
    },
    {
        path : '/attendance',
        element : <AttendancePage />
    }
])