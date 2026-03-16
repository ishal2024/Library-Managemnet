import api from './config'

export async function getDashboardData(){
    return await api.get('/dashboard/' , {withCredentials : true})
}

export async function getPaymentLog(date){
    return await api.post('/dashboard/payment' , {date : date}, {withCredentials : true})
}
