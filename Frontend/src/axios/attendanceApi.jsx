import api from "./config";


export async function checkIn(data){
    return await api.post(`/user/checkin/` , data , {withCredentials : true})
}

export async function getCheckoutInfo(userId){
    return await api.get(`/attendance/info/checkout/${userId}` , {withCredentials : true})
}


export async function checkOut(userId){
    return await api.get(`/user/checkout/${userId}` , {withCredentials : true})
}

export async function getAttendanceOfAnyParticularDay(date){
    return await api.post(`/attendance/daily` ,{date : date} , {withCredentials : true})
}

export async function getUserAttendanceAtSpecificDate(data) {
    return await api.post(`/attendance/user` ,data , {withCredentials : true})
}