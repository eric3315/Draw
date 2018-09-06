import React from 'react';
import DatePicker from 'react-mobile-datepicker';
import {Form, Input} from 'antd';
import {format} from '../utils/utils';
import button03 from '../static/images/button03.png';

const FormItem = Form.Item;

class OtherForm extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
            time: '',
            isOpen: false,
            effectiveDateFlag: true,
        }
    }

    componentDidMount(){
    }

    handleDatePicker=(e)=>{
        e.preventDefault();
        this.setState({ isOpen: true });
    }
    handleDatePickerSelect=(time)=>{
        let timer =format(time, 'yyyy-MM-dd');
        this.setState({
            time: timer,
            isOpen: false,
            effectiveDateFlag: true,
        });
    }
    handleDatePickerCancel=()=>{
        this.setState({ isOpen: false });
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (typeof values.cardName!=='undefined' &&
                typeof values.identityCard!=='undefined' &&
                /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(values.identityCard) &&
                this.state.time!=''
            ) {
                this.props.handleOtherInsuranceSubmit(values.cardName,values.identityCard,this.state.time);
                this.props.form.resetFields(['cardName','identityCard']);
                this.setState({time: '',});
            }else {
                this.setState({effectiveDateFlag: false});
                return false;
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <section className="modal">
                <div className="Active-prize-wrap13" style={{
                    height: '19.5rem',
                }}>
                    <p>请填写交通意外险投保信息</p>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('cardName', {
                                rules: [{ required: true, message: '请输入姓名' }],
                            })(
                                <Input placeholder="姓名"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('identityCard', {
                                rules: [{ required: true, message: '请输入身份证' , pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/}],
                            })(
                                <Input placeholder="身份证"/>
                            )}
                        </FormItem>
                        <div>
                            <input type="text" placeholder="生效日期(有效期7天)" value={this.state.time} readOnly onClick={e=>{this.handleDatePicker(e)}}/>
                            <DatePicker
                                isOpen={this.state.isOpen}
                                onSelect={this.handleDatePickerSelect}
                                onCancel={this.handleDatePickerCancel}
                                min={new Date(2018,8,15)}
                                max={new Date(2018,10,23)}
                            />
                        </div>
                        {
                            !this.state.effectiveDateFlag && <div style={{
                                fontSize: '0.6rem',
                                color: '#fff',
                                marginTop: '-0.5rem',
                            }}>请选择生效日期(有效期7天)</div>
                        }
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
export default (Form.create()(OtherForm));