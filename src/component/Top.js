import React from 'react';
import {connect} from 'react-redux';
import person from '../static/images/person.png';
import close01 from'../static/images/close01.png';
import action from "../store/action";

class Top extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={

        }
    }

    componentDidMount(){
    }

    render(){
        let {userInfo} = this.props;
        return (
            <header className="Active-header" id="Active-header">
                <a href="javascript:;"><img src={close01} alt=""/></a>
                <span>{userInfo.userMobile}</span>
                <img src={person} alt=""/>
            </header>
        )
    }
}
export default connect(state=>({...state.login}), action.login)((Top));