import api from "./config";


export async function assignSeat(data){
    return await api.post('/user/assign/seat' , data , {withCredentials : true})
}

export async function getAllSeats(){
    return await api.get('/seats/' , {withCredentials : true})
}

export async function getLiveSeatMatrix(){
    return await api.get('/seats/seat-matrix/live' , {withCredentials : true})
}

export async function deAllocateUserSeat(data){
return await api.post('/seats/seat/delete' ,data, {withCredentials : true})
}