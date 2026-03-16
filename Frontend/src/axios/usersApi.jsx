import api from "./config";

export async function getAllUser(data){
    return api.get('/user/' , {withcredentials : true})
}

export async function addUser(data){
    return api.post('/user/create' , data , {withcredentials : true})
}

export async function getSpecificUserData(userId){
    return api.get(`/user/${userId}` , {withcredentials : true})
}

export async function updateUser(data , userId){
    return api.post(`/user/update/${userId}` , data , {withcredentials : true})
}

export async function removeUser( userId){
    return api.get(`/user/delete/${userId}` , {withcredentials : true})
}

