import axios from './index';

//抽奖
export function luckDraw(payload){
    return axios({
        method: 'POST',
        url: '/luckDraw',
        data: payload,
    });
}