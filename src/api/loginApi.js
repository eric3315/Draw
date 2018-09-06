import axios from './index';

export function sendVlidateCode(payload){
    return axios({
        method: 'POST',
        url: '/api/sendVlidateCode',
        data: payload,
    });
}
export function loginIn(payload){
    return axios({
        method: 'POST',
        url: '/api/login',
        data: payload,
    });
}

export function logout(payload){
    return axios({
        method: 'GET',
        url: '/api/logout',
        params: payload,
    });
}