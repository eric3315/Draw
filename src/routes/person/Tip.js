import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { Alert, Button  } from 'antd';

class Tip extends React.Component{
    constructor(props, context){
        super(props, context);
    }
    render(){
        return (
            <div>
                <Alert
                    message="未登录提醒"
                    description="尊敬的用户，您当前还未登录，登录后才可以查看个人信息！"
                    type="warning"
                />
                <Button type="primary" onClick={e => {
                    this.props.history.push('/person/login');
                }}>立即登录</Button>
                <Button type="primary" onClick={e => {
                    this.props.history.push('/person/register');
                }}>注册</Button>
            </div>
        )
    }
}

export default withRouter(connect()(Tip));