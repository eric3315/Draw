import * as Type from '../action-types';

let prize={
    savePrize(payload={}){
        return {
            type: Type.SAVE_PRIZE,
            payload,
        }
    }
}
export default prize;