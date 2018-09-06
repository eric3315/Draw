import React from 'react';
import person from '../static/images/person.png';
import close01 from'../static/images/close01.png';
import {logout} from '../api/loginApi';
import {Toast} from'antd-mobile';
import {withRouter} from 'react-router-dom';

class Top extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={

        }
    }

    componentDidMount(){
    }
    handerLogout= async (e)=>{
        e.preventDefault();
        let result = await logout({
            urlChannel: 'c22',
        });
        if(result.success){
            sessionStorage.removeItem('userMobile');
            sessionStorage.removeItem('luckDrawNum');
            this.props.history.push('/login');
        } else {
            Toast.info(result.messageTip, 1);
        }
    }
    render(){
        let userMobile=sessionStorage.getItem('userMobile');
        if(!userMobile){
            userMobile='';
        }
        if(userMobile=='') return '';
        return (
            <header className="Active-header" id="Active-header">
                <a href="javascript:;" onClick={e=>{this.handerLogout(e)}}><img src={close01} alt=""/></a>
                <span>{userMobile}</span>
                <img src={person} alt=""/>
            </header>
        )
    }
}
export default withRouter(Top);