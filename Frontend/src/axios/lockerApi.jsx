import api from "./config";

export async function assignLocker(data){
    return await api.post('/user/assign/locker' , data , {withCredentials : true})
}

export async function getAllLockers(){
    return await api.get('/locker/' , {withCredentials : true})
}

export async function deAllocateUserLocker(data){
return await api.post('/locker/delete' ,data, {withCredentials : true})
}