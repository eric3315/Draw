import * as Type from '../action-types';

let login={
    queryUserInfo(payload={}){
        return {
            type: Type.LOGIN_IN,
            payload,
        }
    }
}
export default login;