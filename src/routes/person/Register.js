import React from 'react';
import {connect} from 'react-redux';
import { Form, Icon, Input, Button, Modal, Row, Col } from 'antd';
import md5 from 'blueimp-md5';
import {register} from '../../api/personApi';
import action from '../../store/action';

const FormItem = Form.Item;


class Register extends React.Component{
    constructor(props, context){
        super(props, context);
    }
    registerFail =(flag) =>{
        let modal=null;
        if(flag){
            modal = Modal.success({
                title: '注册成功',
                content: ''
            });
        } else{
            modal = Modal.error({
                title: '注册失败',
                content: '请稍后重试'
            });
        }
        setTimeout(() => modal.destroy(), 1000);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                values.userPass =md5(values.userPass);
                let result = await register({
                    name: values.userName,
                    email: values.email,
                    phone: values.phone,
                    password: values.userPass,
                });
                if(parseFloat(result.code) === 0){
                    this.registerFail(true);
                    this.props.queryBaseInfo();
                    this.props.history.push('/person');
                    return;
                } else{
                    this.registerFail(false);
                    return;
                }
            }
        });
    }



    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return (
            <section className='personRegisterBox'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                    >
                        {getFieldDecorator('userName',{
                            rules: [{ required: true, message: '请输入用户名!'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                    >
                        {getFieldDecorator('userPass')(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机"
                    >
                        {getFieldDecorator('phone')(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="邮箱"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: '输入的邮箱不正确',
                            }, {
                                required: true, message: '请输入邮箱',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">注册</Button>
                    </FormItem>
                </Form>
            </section>
        )
    }
}
export default Form.create()(connect(null, action.person)(Register));