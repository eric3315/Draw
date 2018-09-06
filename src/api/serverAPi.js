import axios from './index';

//抽奖
export function luckDraw(payload){
    return axios({
        method: 'POST',
        url: '/api/luckDraw',
        data: payload,
    });
}
//查看我的奖品
export function myPrize(payload){
    return axios({
        method: 'GET',
        url: '/api/myPrize',
        params: payload,
    });
}

//领取奖品
export function getMyPrize(payload){
    return axios({
        method: 'POST',
        url: '/api/getMyPrize',
        data: payload,
    });
}

//提交实物
export function getRecAddr(payload){
    return axios({
        method: 'POST',
        url: '/api/getRecAddr',
        data: payload,
    });
}

//提交保险信息
export function getRecInsurance(payload){
    return axios({
        method: 'POST',
        url: '/api/getRecInsurance',
        data: payload,
    });
}