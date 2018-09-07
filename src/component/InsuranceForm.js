import React from 'react';
import DatePicker from 'react-mobile-datepicker';
import {format} from '../utils/utils';
import {Form, Input} from 'antd';
import button02 from '../static/images/button02.png';

const FormItem = Form.Item;



class InsuranceForm extends React.Component{
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
            if (typeof values.cardName!=='undefined' &&
                typeof values.identityCard!=='undefined' &&
                /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(values.identityCard) &&
                this.state.time!=''
            ) {
                this.props.handleFirstPrizeSubmit(values.cardName,values.identityCard,this.state.time);
            } else {
                this.setState({effectiveDateFlag: false});
                return false;
            }
        });
    }
    handleHideModal=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.props.handleHideInsurance();
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {userInfo:{prizeName}} = this.props;
        return (
            <section className="modal" onClick={e=>{this.handleHideModal(e)}}>
                <div className="Active-prize-wrap12">
                    <p>恭喜!您已获得{prizeName}和价值100万的交通意外险，请及时领取。</p>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('cardName', {
                                rules: [{ required: true, message: '请输入姓名' , pattern:/^[\u4E00-\u9FA5]{2,4}$/ }],
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
                                min={new Date()}
                                max={new Date(2018,10,24)}
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
                                <img src={button02} alt="" />
                            </button>
                        </FormItem>
                    </Form>
                </div>
            </section>
        )
    }
}
export default (Form.create()(InsuranceForm));