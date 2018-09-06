import axios from './index';

export function sendVlidateCode(payload){
    return axios({
        method: 'POST',
        url: '/sendVlidateCode',
        data: payload,
    });
}
export function loginIn(payload){
    return axios({
        method: 'POST',
        url: '/login',
        data: payload,
    });
}

export function logout(payload){
    return axios({
        method: 'GET',
        url: '/logout',
        params: payload,
    });
}