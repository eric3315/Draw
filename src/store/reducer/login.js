import * as Type from '../action-types';

let INIT_STATE={
    userInfo: {
        userMobile: '',
        luckDrawNum: '',
    },
};
export default function login(state = INIT_STATE,action){
    state=JSON.parse(JSON.stringify(state));
    let payload={};
    switch (action.type) {
        case Type.LOGIN_IN:
            payload =action.payload;
            state ={...state,userInfo:payload};
            break;
    }
    return state;
}