import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, Modal } from 'antd';
import md5 from 'blueimp-md5';
import {login} from '../../api/personApi';
import action from '../../store/action';

const FormItem = Form.Item;

class Login extends React.Component{
    constructor(props, context){
        super(props, context);
    }
    loginFail =(flag) =>{
        let modal=null;
        if(flag){
            modal = Modal.success({
                title: '登录成功',
                content: ''
            });
        } else{
            modal = Modal.error({
                title: '登录失败',
                content: '请稍后重试'
            });
        }
        setTimeout(() => modal.destroy(), 1000);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let {userName, userPass} = values;
                userPass = md5(userPass);
                let result = await login({
                    name: userName,
                    password: userPass,
                });
                if(parseFloat(result.code) === 0){
                    this.loginFail(true);
                    this.props.queryBaseInfo();
                    this.props.history.go(-1);
                    return;
                } else{
                    this.loginFail(false);
                    return;
                }
            }
        });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='personLoginBox'>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('userPass', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        Or <Link to="/person/register">立即注册</Link>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(connect(null,action.person)(Login));