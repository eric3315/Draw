import React from 'react';
import {connect} from 'react-redux';
import Top from '../component/Top';
import LotteryNumber from '../component/LotteryNumber';
import logo from '../static/images/logo.png';
import table from '../static/images/table.png';
import button04 from '../static/images/button04.png';
import button02 from '../static/images/button02.png';
import button03 from '../static/images/button03.png';
import chassis from '../static/images/chassis.png';
import pointer from '../static/images/pointer.png';
import turn from '../static/images/turn.png';
import {Toast} from'antd-mobile';
import {luckDraw} from '../api/serverAPi';
import action from '../store/action';
import {withRouter} from 'react-router-dom';
import DatePicker from 'react-mobile-datepicker';
import {format} from '../utils/utils';
import {Form } from 'antd';

const FormItem = Form.Item;
let rotateArr = [25.7,77.1,128.5,180,231.4,283,334];

class RotaryDraw extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
            drawFlag: true,
            time: '',
            isOpen: false,
            effectiveDateFlag: true,
        }
    }
    componentDidMount(){
    }

    handleRotating= async (e)=>{
        e.preventDefault();
        let userMobile=sessionStorage.getItem('userMobile');
        if(!userMobile){
            userMobile='';
        }
        let result = await luckDraw({
            userMobile: userMobile,
            urlChannel: 'c22',
        });

        if(result.success){
            if(typeof result.redirect !== 'undefined' && result.redirect === 'login'){
                Toast.info('请您先登录再进行抽奖', 3);
                //跳转到登录页面
                setTimeout(()=>{
                    this.props.history.push('/login');
                },2000);
                return;
            } else {
                let timer = null;
                let rotate=0;
                let turnId = document.getElementById('turnId');
                turnId.style.transform = "rotate(0deg)";
                let count =10;
                if(timer){
                    clearInterval(timer);
                    return;
                }
                timer=setInterval(()=>{
                    if(rotate>360){
                        rotate=0;
                    }
                    turnId.style.transform = `rotate(${rotate+=count}deg)`;
                },1);

                setTimeout(()=>{
                    clearInterval(timer);
                    let rotateNum=0;
                    switch (result.prizeName){
                        case '电子导游':
                            rotateNum = rotateArr[0];
                            break;
                        case '快速安检通道':
                            rotateNum = rotateArr[1];
                            break;
                        case '旅行收纳包':
                            rotateNum = rotateArr[2];
                            break;
                        case '10元U行优惠券':
                            rotateNum = rotateArr[3];
                            break;
                        case '旅行颈枕':
                            rotateNum = rotateArr[4];
                            break;
                        case '机场贵宾厅':
                            rotateNum = rotateArr[5];
                            break;
                        case '手机':
                            rotateNum = rotateArr[6];
                            break;
                    }
                    turnId.style.transform = `rotate(${rotateNum}deg)`;
                    //获取最新的抽奖次数存储到sessionStorage
                    sessionStorage.setItem('luckDrawNum',result.luckDrawNum);
                    this.setState({drawFlag: false});
                    if(result.isFirstLuckDraw){
                        //第一次抽奖
                        if(typeof result.userXingMing!=='undefined' && typeof result.userIDNumber!=='undefined'){
                            //记录store
                            this.props.savePrize({
                                winPrizeRecordId: result.prizeRecordId,
                                userXingMing: result.userXingMing,
                                userIDNumber: result.userIDNumber,
                            })
                        } else {
                            //记录store
                            this.props.savePrize({
                                winPrizeRecordId: result.prizeRecordId,
                                userXingMing: '',
                                userIDNumber: '',
                            })
                        }
                        //跳转到首次中奖页面
                        this.props.history.push('/firstPrizeOne');
                    } else {
                        //10元U行优惠券跳转页面到 /coupons
                        if(result.prizeName === '10元U行优惠券'){
                            this.handleBut2Open();
                        } else {
                            this.handleBut1Open();
                        }
                    }

                    return;
                },4000);
            }
        } else {
            Toast.info(result.messageTip, 3);
            return;
        }
    }

    handleFirstPrizeSubmit= (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (typeof values.userName!=='undefined' &&
                typeof values.identityCard!=='undefined' &&
                /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(values.identityCard) &&
                this.state.time!=''
            ) {
                console.info(JSON.stringify(values), this.state.time);
            } else {
                this.setState({effectiveDateFlag: false});
                return false;
            }
        });
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

    handleAwardSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(typeof values.userName!=='undefined' &&
                typeof values.address!=='undefined' &&
                typeof values.telPhone!=='undefined'
            ){
                //正常提交领取奖品
                console.info('正常提交领取奖品');
            } else {
                return false;
            }
        });
    }

    /*其他电子码弹窗 begin*/
    handleBut1Open=()=>{
        let modelBut1= document.getElementById('modelBut1');
        modelBut1.style.display='block';
    }
    handleBut1=(e)=>{
        let modelBut1= document.getElementById('modelBut1');
        modelBut1.style.display='none';
    }
    /*其他电子码弹窗 begin*/

    /*U行优惠券弹窗 begin*/
    handleBut2Open=()=>{
        let modelBut2= document.getElementById('modelBut2');
        modelBut2.style.display='block';
    }
    handleBut2=(e)=>{
        let modelBut2= document.getElementById('modelBut2');
        modelBut2.style.display='none';
    }
    /*U行优惠券弹窗 end*/

    /*抽奖次数已用尽弹窗 begin*/
    handleBut3Open=()=>{
        let modelBut3= document.getElementById('modelBut3');
        modelBut3.style.display='block';
    }
    handleBut3=(e)=>{
        let modelBut3= document.getElementById('modelBut3');
        modelBut3.style.display='none';
    }
    /*抽奖次数已用尽弹窗 end*/
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Top/>
                <main className="Active-main" id="Active-main" style={{
                    height: 'auto'
                }}>
                    <section className="Active-main-logo"><img src={logo} alt="" /></section>
                    <section className="Active-turntable">
                        <img src={chassis} alt="" className="Active-turntable-rotary" />
                        <img src={turn} alt="" className="Active-turntable-pointer" id='turnId'/>
                        <img src={pointer} alt="" className="Active-turntable-start" onClick={e=>this.handleRotating(e)}/>
                    </section>
                    <LotteryNumber />
                    <section className="active-detail">
                        <div className="active-detail-wrap">
                            <h2>活动详情</h2>
                            <p>(1)活动时间：2018年9月15日至2018年11月30日；</p>
                            <p>(2)活动期间用户拨打114/116114电话查询或预定产品可获得抽奖机会，关注U行公众号可获得1次抽奖机会，具体兑换规则如下：</p>
                            <img src={table} alt="" />
                            <p>
                                (3)用户获得奖品后需前往领奖页面，依据领奖流程填写个人信息后领取；
                            </p>
                            <p>
                                (4)如参与抽奖的手机号未注册过U行账户，需同意<strong>U行服务条款、隐私政策</strong>和<strong>太平金服服务协议</strong>注册成为U行和太平金服会员后可参与本活动；
                            </p>
                            <p>
                                (5)同一用户不可重复参加本活动，同一用户指与用户身份相关信息（如手机号、身份证号、U行账号、终端设备等），其中任意一项或多项存在相同或非真实有效等情况时，均可能被认定为同一用户，并按同一用户规则处理；
                            </p>
                            <p>
                                (6)如享受抽奖资格的订单发生退款或取消订单，将退还用户实际支付的金额，抽奖资格后续不予补发；
                            </p>
                            <p>
                                (7)在本活动期间，如存在违规行为（包括但不限于恶意套取资金、机器作弊、虚假交易等违反诚实信用原则行为），主办方将取消您的中奖资格，并有权撤销相关违规交易和奖励，必要时追究法律责任；
                            </p>
                            <p>
                                (8)如出现不可抗力或情势变更的情况（包括但不限于重大灾害事件、活动受政府机关指令需要停止举办或调整的、活动遭受严重网络攻击或因系统故障需要暂停举办的），主办方有权暂停或取消本次活动，并可依相关法律法规的规定主张免责；
                            </p>
                            <p>
                                (9)活动最终解释权归U行所有。如需进一步了解活动规则，请咨询客服电话114。
                            </p>
                        </div>
                    </section>
                    <section className="modal" id='modelBut1' style={{
                        display: 'none',
                    }}>
                        <div className="Active-over-wrap">
                            <p>我们将在活动结束后20个工作日内向您的手机发送电子码,请注意查收。</p>
                            <button type="button" onClick={e=>{this.handleBut1(e)}}><img src={button04} alt="" /></button>
                        </div>
                    </section>
                    <section className="modal" id='modelBut2' style={{
                        display: 'none',
                    }}>
                        <div className="Active-over-wrap">
                            <p>您获得的出行优惠券已放入手机号，登陆'U行' 即可使用。</p>
                            <button type="button" onClick={e=>{this.handleBut2(e)}}><img src={button04} alt="" /></button>
                        </div>
                    </section>
                    <section className="modal" id='modelBut3' style={{
                        display: 'none',
                    }}>
                        <div className="Active-over-wrap">
                            <h2>抱歉</h2>
                            <p style={{
                                lineHeight: '2.5rem',
                            }}>您的抽奖次数已用尽</p>
                            <button type="button" onClick={e=>{this.handleBut3(e)}}><img src={button04} alt="" /></button>
                        </div>
                    </section>
                    <section className="modal" id='modelBut4' style={{
                        display: 'none',
                    }}>
                        <div className="Active-over-wrap">
                            <p style={{
                                marginBottom: '2.2rem',
                            }}>恭喜! 您已获得机场贵宾厅权益，请及时领取。</p>
                            <button type="button" onClick={e=>{this.handleBut4(e)}}><img src={button04} alt="" /></button>
                        </div>
                    </section>
                    <section className="modal" id='modelBut5' style={{
                        display: 'block',
                    }}>
                        <div className="Active-over-prize1">
                            <ul>
                                <li>
                                    <span>1</span>
                                    <p className="Active-over-prize-p1">手机</p>
                                    <p className="Active-over-prize-p2">--2018.09.01--</p>
                                    <a href="javascript:;">领取</a>
                                </li>
                                <li>
                                    <span>2</span>
                                    <p className="Active-over-prize-p1">旅行收纳包</p>
                                    <p className="Active-over-prize-p2">--2018.09.02--</p>
                                    <a href="javascript:;">领取</a>
                                </li>
                                <li>
                                    <span>3</span>
                                    <p className="Active-over-prize-p1">手机</p>
                                    <p className="Active-over-prize-p2">--2018.09.01--</p>
                                    <a href="javascript:;">领取</a>
                                </li>
                                <li>
                                    <span>4</span>
                                    <p className="Active-over-prize-p1">100万保额交通意外险</p>
                                    <p className="Active-over-prize-p2">--2018.09.02--</p>
                                    <a href="javascript:;">领取</a>
                                </li>
                                <li>
                                    <span>5</span>
                                    <p className="Active-over-prize-p1">100元国际机票抵用券</p>
                                    <p className="Active-over-prize-p2">--2018.09.01--</p>
                                    <a href="javascript:;">领取</a>
                                </li>
                                <li>
                                    <span>6</span>
                                    <p className="Active-over-prize-p1">旅行收纳包</p>
                                    <p className="Active-over-prize-p2">--2018.09.02--</p>
                                    <a href="javascript:;">领取</a>
                                </li>
                                <li>
                                    <span>7</span>
                                    <p className="Active-over-prize-p1">手机</p>
                                    <p className="Active-over-prize-p2">--2018.09.01--</p>
                                    <a href="javascript:;">领取</a>
                                </li>
                                <li>
                                    <span>8</span>
                                    <p className="Active-over-prize-p1">旅行收纳包</p>
                                    <p className="Active-over-prize-p2">--2018.09.02--</p>
                                    <a href="javascript:;">领取</a>
                                </li>
                                <li>
                                    <span>9</span>
                                    <p className="Active-over-prize-p1">旅行收纳包</p>
                                    <p className="Active-over-prize-p2">--2018.09.02--</p>
                                    <a href="javascript:;">领取</a>
                                </li>

                            </ul>
                        </div>
                    </section>
                    <section className="modal" id='modelBut6' style={{
                        display: 'none',
                    }}>
                        <div className="Active-prize-wrap12">
                            <p>恭喜!您已获得机场贵宾厅权益和价值100万的交通意外险，请及时领取。</p>
                            <Form onSubmit={this.handleFirstPrizeSubmit}>
                                <FormItem>
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: '请输入姓名' }],
                                    })(
                                        <div>
                                            <input type="text" placeholder="姓名" />
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('identityCard', {
                                        rules: [{ required: true, message: '请输入身份证' , pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/}],
                                    })(
                                        <div>
                                            <input type="text" placeholder="身份证" />
                                        </div>
                                    )}
                                </FormItem>
                                <div>
                                    <input type="text" placeholder="生效日期" value={this.state.time} readOnly onClick={e=>{this.handleDatePicker(e)}}/>
                                    <DatePicker
                                        isOpen={this.state.isOpen}
                                        onSelect={this.handleDatePickerSelect}
                                        onCancel={this.handleDatePickerCancel}
                                    />
                                </div>
                                {
                                    !this.state.effectiveDateFlag && <div style={{
                                        fontSize: '0.6rem',
                                        color: '#fff',
                                        marginTop: '-0.5rem',
                                    }}>请选择生效日期</div>
                                }
                                <FormItem>
                                    <button type="submit">
                                        <img src={button02} alt="" />
                                    </button>
                                </FormItem>
                            </Form>
                        </div>
                    </section>
                    <section className="modal" id='modelBut7' style={{
                        display: 'none',
                    }}>
                        <div className="Active-prize-wrap13" style={{
                            height: '19.5rem',
                        }}>
                            <p>请填写收货信息,我们将在活动结束后20个工作日内为您寄送奖品。</p>
                            <Form onSubmit={this.handleAwardSubmit}>
                                <FormItem>
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: '请输入姓名' }],
                                    })(
                                        <div>
                                            <input type="text" placeholder="姓名" />
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('address', {
                                        rules: [{ required: true, message: '请输入地址' }],
                                    })(
                                        <div>
                                            <input type="text" placeholder="地址" />
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('telPhone', {
                                        rules: [{ required: true, message: '请输入联系电话' }],
                                    })(
                                        <div>
                                            <input type="text" placeholder="联系电话" />
                                        </div>
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
                </main>
            </div>
        )
    }
}
export default withRouter(connect(state=>({...state.prize}), action.prize)(Form.create()(RotaryDraw)));