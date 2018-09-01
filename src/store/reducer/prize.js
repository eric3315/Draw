import * as Type from '../action-types';

let INIT_STATE={
    prizeInfo: {
        winPrizeRecordId: '',
    },
};
export default function prize(state = INIT_STATE,action){
    state=JSON.parse(JSON.stringify(state));
    let payload={};
    switch (action.type) {
        case Type.SAVE_PRIZE:
            payload =action.payload;
            state ={...state,prizeInfo:payload};
            break;
    }
    return state;
}