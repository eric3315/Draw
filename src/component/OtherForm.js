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
        const { userXingMing='', userIDNumber=''} = this.props.userInfo;
        if(userIDNumber){
            this.props.form.setFieldsValue({
                cardName: userXingMing,
                identityCard: `${userIDNumber.substr(0,14)}****`,
            });
        }
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
            if(typeof values.identityCard!=='undefined' && values.identityCard.substr(values.identityCard.length-4) === '****'){
                if (typeof values.cardName!=='undefined' &&
                    typeof values.identityCard!=='undefined' &&
                    this.state.time!=''
                ) {
                    this.props.handleOtherInsuranceSubmit(values.cardName,values.identityCard,this.state.time);
                } else {
                    if(!this.state.time){
                        this.setState({effectiveDateFlag: false});
                    }
                    return false;
                }
            } else {
                if (typeof values.cardName!=='undefined' &&
                    typeof values.identityCard!=='undefined' &&
                    /^.{18}$/.test(values.identityCard)&&
                    this.state.time!=''
                ) {
                    this.props.handleOtherInsuranceSubmit(values.cardName,values.identityCard,this.state.time);
                } else {
                    if(!this.state.time){
                        this.setState({effectiveDateFlag: false});
                    }
                    return false;
                }
            }
            return false;
        });
    }
    handleHideModal=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.props.handleHideOtherInsurance();
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <section className="modal" onClick={e=>{this.handleHideModal(e)}}>
                <div className="Active-prize-wrap133" style={{
                    height: '19.5rem',
                    paddingTop: '3rem',
                }}>
                    <p style={{
                        fontSize: '1rem',
                        textIndent: '1.5rem',
                    }}>请填写交通意外险投保信息</p>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('cardName', {
                                rules: [{ required: true, message: '请输入真实姓名' }],
                            })(
                                <Input placeholder="真实姓名"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('identityCard', {
                                rules: [{ required: true, message: '请输入真实身份证信息', pattern: /^.{18}$/}],
                            })(
                                <Input placeholder="真实身份证信息"/>
                            )}
                        </FormItem>
                        <div>
                            <input type="text" placeholder="选择保障生效日期(有效期7天)" value={this.state.time} readOnly onClick={e=>{this.handleDatePicker(e)}}/>
                            <DatePicker
                                isOpen={this.state.isOpen}
                                onSelect={this.handleDatePickerSelect}
                                onCancel={this.handleDatePickerCancel}
                                min={new Date()}
                                max={new Date(2018,10,24)}
                            />
                        </div>
                        {
                            !this.state.effectiveDateFlag && <div style={{
                                fontSize: '0.6rem',
                                color: '#fff',
                                marginTop: '-0.5rem',
                            }}>请选择保障生效日期(有效期7天)</div>
                        }
                        <FormItem>
                            <button type="submit" style={{marginTop: '1rem'}}>
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