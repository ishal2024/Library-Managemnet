import api from "./config";


export async function getAllUsersPayments(date){
      return await api.post('/payment/' , {date : date} , {withCredentials : true})
}

export async function createPayment(data){
      return await api.post('/user/create/payment' , data, {withCredentials : true})
}

export async function updatePayment(data , paymentId){
      return await api.post(`/payment/update/${paymentId}` , data, {withCredentials : true})
}

export async function deletePayment(paymentId){
      return await api.get(`/payment/delete/${paymentId}` , {withCredentials : true})
}