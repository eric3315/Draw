import React from 'react';
import Top from '../component/Top';
import logo from '../static/images/logo.png';
import table from '../static/images/table.png';
import button04 from '../static/images/button04.png';
import {Form} from 'antd';

const FormItem = Form.Item;

class VirtualPrize extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={

        }
    }
    componentDidMount(){
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Top/>
                <main className="Active-main" id="Active-main" style={{
                    height: 'auto'
                }}>
                    <section className="Active-main-logo" style={{
                        marginBottom: '16rem',
                    }}><img src={logo} alt="" /></section>
                    <section className="Active-over" style={{
                        paddingTop:'2.5rem',
                    }}>
                        <div className="Active-over-wrap">
                            <p>我们将在活动结束后20个工作日内向您的手机发送电子码,请注意查收。</p>
                            <button type="submit">
                                <img src={button04} alt="" />
                            </button>
                        </div>
                    </section>
                    <section className="active-frequency">
                        <a href="javascript:;">查看我的奖品</a>
                        <h2>剩余<span>10</span>次抽奖机会</h2>
                    </section>
                    <section className="active-detail">
                        <div className="active-detail-wrap">
                            <h2>活动详情</h2>
                            <p>(1)活动时间：2018年9月1日至2018年11月30日；</p>
                            <p>(2)活动期间用户拨打114/116114电话查询或预定产品可获得抽奖机会，关注联通旅行公众号可获得1次抽奖机会，具体兑换规则如下：</p>
                            <img src={table} alt="" />
                            <p>
                                (3)用户获得奖品后需前往太平金服领奖页面，依据领奖流程填写个人信息后领取；
                            </p>
                            <p>
                                (4)如参与抽奖的手机号未注册过联通旅行账户，需同意联通旅行服务条款和隐私政策注册成为联通旅行会员后可参与本活动；
                            </p>
                            <p>
                                (5)同一用户不可重复参加本活动，同一用户指与用户身份相关信息（如手机号、身份证号、联通旅行账号、终端设备等），其中任意一项或多项存在相同或非真实有效等情况时，均可能被认定为同一用户，并按同一用户规则处理；
                            </p>
                            <p>
                                (6)如享受抽奖资格的订单发生退款或取消订单，将退还用户实际支付的金额，抽奖资格后续不予补发；
                            </p>
                            <p>
                                (7)在本活动期间，如存在违规行为（包括但不限于恶意套取资金、机器作弊、虚假交易等违反诚实信用原则行为），主办方将取消您的中奖资格，并有权撤销相关违规交易和奖励，必要时追究法律责任；
                            </p>
                            <p>
                                (8)
                                如出现不可抗力或情势变更的情况（包括但不限于重大灾害事件、活动受政府机关指令需要停止举办或调整的、活动遭受严重网络攻击或因系统故障需要暂停举办的），主办方有权暂停或取消本次活动，并可依相关法律法规的规定主张免责；
                            </p>
                            <p>
                                (9)活动最终解释权归联通旅行所有。需进一步了解活动规则，请咨询客服电话114。
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}
export default (Form.create()(VirtualPrize));