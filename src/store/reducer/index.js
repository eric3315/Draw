import { combineReducers } from 'redux';
import login from './login';
import prize from './prize';

let reducer=combineReducers({
    login,
    prize,
});
export default reducer;