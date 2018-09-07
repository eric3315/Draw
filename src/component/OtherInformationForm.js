import React from 'react';
import {Form, Input} from 'antd';
import button03 from '../static/images/button03.png';

const FormItem = Form.Item;

class OtherInformationForm extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
        }
    }

    componentDidMount(){
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (typeof values.userName!=='undefined' &&
                typeof values.address!=='undefined' &&
                typeof values.telPhone!=='undefined') {
                this.props.handleOtherAwardSubmit(values.userName,values.address,values.telPhone);
            } else {
                return false;
            }
        });
    }
    handleHideModal=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.props.handleHideOtherInformation();
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <section className="modal"  onClick={e=>{this.handleHideModal(e)}}>
                <div className="Active-prize-wrap13" style={{
                    height: '19.5rem',
                }}>
                    <p>请填写收货信息,我们将在活动结束后20个工作日内为您寄送奖品。</p>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入姓名' }],
                            })(
                                <Input placeholder="姓名"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('address', {
                                rules: [{ required: true, message: '请输入地址' }],
                            })(
                                <Input placeholder="地址"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('telPhone', {
                                rules: [{ required: true, message: '请输入联系电话' }],
                            })(
                                <Input placeholder="联系电话"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <button type="submit">
                                <img src={button03} alt="" />
                            </button>
                        </FormItem>
                    </Form>
                </div>
            </section>
        )
    }
}
export default (Form.create()(OtherInformationForm));