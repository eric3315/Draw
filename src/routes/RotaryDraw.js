import React from 'react';
import Top from '../component/Top';
import logo from '../static/images/logo.png';
import table from '../static/images/table.png';
import button04 from '../static/images/button04.png';
import button02 from '../static/images/button02.png';
import button03 from '../static/images/button03.png';
import chassis from '../static/images/chassis.png';
import pointer from '../static/images/pointer.png';
import turn from '../static/images/turn.png';
import {Toast, Modal} from'antd-mobile';
import {luckDraw, getMyPrize, myPrize, getRecAddr} from '../api/serverAPi';
import DatePicker from 'react-mobile-datepicker';
import {format} from '../utils/utils';
import {Form, Input} from 'antd';

const FormItem = Form.Item;
const alert = Modal.alert;
let rotateArr = [25.7,77.1,128.5,180,231.4,283,334];

class RotaryDraw extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
            drawFlag: true,
            time: '',
            isOpen: false,
            effectiveDateFlag: true,
            userInfo:{
                winPrizeRecordId: '',
                userXingMing: '',
                userIDNumber: '',
                prizeName: '',
                isFirstLuckDraw: true,
            },
            prizeList:[],
        }
    }
    componentDidMount(){
    }

    handleRotating= async (e)=>{
        e.preventDefault();
        let userMobile=sessionStorage.getItem('userMobile');
        let luckDrawNum=sessionStorage.getItem('luckDrawNum');
        if(!userMobile){
            userMobile='';
        }
        if(luckDrawNum == null || luckDrawNum > 0){
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
                        console.info(result.prizeName);
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
                        turnId.style.transform = `rotate(${-rotateNum}deg)`;
                        //获取最新的抽奖次数存储到sessionStorage
                        sessionStorage.setItem('luckDrawNum',result.luckDrawNum);
                        this.setState({drawFlag: false});
                        let userInfo=null;
                        if(result.isFirstLuckDraw){
                            //第一次抽奖
                            if(typeof result.userXingMing!=='undefined' && typeof result.userIDNumber!=='undefined'){
                                userInfo = {
                                    winPrizeRecordId: result.prizeRecordId,
                                    userXingMing: result.userXingMing,
                                    userIDNumber: result.userIDNumber,
                                    prizeName: result.prizeName,
                                    isFirstLuckDraw: result.isFirstLuckDraw,
                                }
                            } else {
                                userInfo = {
                                    winPrizeRecordId: result.prizeRecordId,
                                    userXingMing: '',
                                    userIDNumber: '',
                                    prizeName: result.prizeName,
                                }
                            }
                            this.setState({
                                userInfo,
                            },()=>{
                                console.info(`保存用户信息数据到userInfo:${JSON.stringify(userInfo)}`);
                            })
                            this.handleBut6Open(result.prizeName);
                        } else {
                            userInfo = {
                                winPrizeRecordId: result.prizeRecordId,
                                prizeName: result.prizeName,
                                isFirstLuckDraw: result.isFirstLuckDraw,
                            }
                            this.setState({
                                userInfo,
                            },()=>{
                                console.info(`保存用户信息数据到userInfo:${JSON.stringify(userInfo)}`);
                            })
                            this.handleBut4Open(result.prizeName);
                            // if(result.prizeName === '10元U行优惠券'){
                            //     this.handleBut2Open();
                            //     return;
                            // } else if(result.prizeName === '手机' || result.prizeName === '旅行颈枕' || result.prizeName === '旅行收纳包'){
                            //
                            //     return;
                            // } else if(result.prizeName === '电子导游' || result.prizeName === '快速安检通道' || result.prizeName === '机场贵宾厅'){
                            //     this.handleBut1Open();
                            //     return;
                            // }
                        }
                        return;
                    },4000);
                }
            } else {
                Toast.info(result.messageTip, 3);
                return;
            }
        } else if(luckDrawNum == 0){
            console.info(luckDrawNum);
            //抽奖次数已用尽
            this.handleBut3Open();
        }
    }

    handleFirstPrizeSubmit= (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (typeof values.cardName!=='undefined' &&
                typeof values.identityCard!=='undefined' &&
                /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(values.identityCard) &&
                this.state.time!=''
            ) {
                const {winPrizeRecordId= '', userXingMing='', userIDNumber='', prizeName='', isFirstLuckDraw} = this.state.userInfo;
                let userMobile=sessionStorage.getItem('userMobile');
                let obj={};
                if(userXingMing && userIDNumber){
                    obj={
                        userMobile,
                        urlChannel: 'c22',
                        isFirstLuckDraw,
                        prizeName,
                        winPrizeRecordId,
                        insuranceXiMing: userXingMing,
                        insuranceIDNumber: userIDNumber,
                        insuranceEffectTime: this.state.time,
                    }
                } else {
                    obj={
                        userMobile,
                        urlChannel: 'c22',
                        isFirstLuckDraw,
                        prizeName,
                        winPrizeRecordId,
                        insuranceXiMing: values.cardName,
                        insuranceIDNumber: values.identityCard,
                        insuranceEffectTime: this.state.time,
                    }
                }
                let result = await getMyPrize(obj);
                if(result.success){
                    //10元U行优惠券跳转页面到 /coupons
                    if(result.prizeName === '10元U行优惠券'){
                        this.handleBut6();
                        this.props.form.resetFields(['cardName','identityCard']);
                        this.setState({time: '',});
                        Toast.info('您的交通意外险已投保成功，请注意查收短信', 3);
                        this.handleBut2Open();
                        return;
                    } else if(result.prizeName === '手机' || result.prizeName === '旅行颈枕' || result.prizeName === '旅行收纳包'){
                        //实物跳转到填写地址是窗口
                        this.handleBut6();
                        this.props.form.resetFields(['cardName','identityCard']);
                        this.setState({time: '',});
                        Toast.info('您的交通意外险已投保成功，请注意查收短信', 3);
                        this.handleBut7Open();
                        return;
                    } else if(result.prizeName === '电子导游' || result.prizeName === '快速安检通道' || result.prizeName === '机场贵宾厅'){
                        this.handleBut6();
                        this.props.form.resetFields(['cardName','identityCard']);
                        this.setState({time: '',});
                        Toast.info('您的交通意外险已投保成功，请注意查收短信', 3);
                        this.handleBut1Open();
                        return;
                    }
                }
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
        console.info(timer);
        this.setState({
            time: timer,
            isOpen: false,
            effectiveDateFlag: true,
        },()=>{
            console.info(this.state.effectiveDateFlag);
        });
    }
    handleDatePickerCancel=()=>{
        this.setState({ isOpen: false });
    }

    handleAwardSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //正常提交领取奖品
            const {winPrizeRecordId= '', prizeName='',} = this.state.userInfo;
            let userMobile=sessionStorage.getItem('userMobile');
            let obj={
                userMobile,
                urlChannel: 'c22',
                prizeName,
                winPrizeRecordId,
                addrXiming: values.userName,
                addr: values.address,
                addrContactMobile: values.telPhone,
            }
            alert('', '亲，提交后就不能修改了哦', [
                { text: '返回', onPress: () => console.log('cancel') },
                { text: '确认', onPress: async () => {
                        let result = await getRecAddr(obj);
                        if(result.success){
                            this.handleBut7();
                            this.props.form.resetFields(['userName','address','telPhone']);
                        }
                    }},
            ])
        });
    }

    handleAwardSubmit1 = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //正常提交领取奖品
            const {winPrizeRecordId= '', prizeName='',} = this.state.userInfo;
            let userMobile=sessionStorage.getItem('userMobile');
            let obj={
                userMobile,
                urlChannel: 'c22',
                prizeName,
                winPrizeRecordId,
                addrXiming: values.userName,
                addr: values.address,
                addrContactMobile: values.telPhone,
            }
            alert('', '亲，提交后就不能修改了哦', [
                { text: '返回', onPress: () => console.log('cancel') },
                { text: '确认', onPress: async () => {
                        let result = await getRecAddr(obj);
                        if(result.success){
                            this.handleBut77();
                            this.handleBut5Open();
                        }
                    }},
            ])
        });
    }

    handleResertTurn=()=>{
        let turnId = document.getElementById('turnId');
        turnId.style.transform = "rotate(0deg)";
    }
    /*其他电子码弹窗 begin*/
    handleBut1Open=()=>{
        let modelBut1= document.getElementById('modelBut1');
        modelBut1.style.display='block';
    }
    handleBut1=(e)=>{
        let modelBut1= document.getElementById('modelBut1');
        modelBut1.style.display='none';
        this.handleResertTurn();
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
        this.handleResertTurn();
    }

    /*其他电子码弹窗 begin*/
    handleBut11Open=()=>{
        let modelBut11= document.getElementById('modelBut11');
        modelBut11.style.display='block';
    }
    handleBut11=(e)=>{
        let modelBut11= document.getElementById('modelBut11');
        modelBut11.style.display='none';
        this.handleResertTurn();
        this.handleBut5Open();
    }
    /*其他电子码弹窗 begin*/

    /*U行优惠券弹窗 begin*/
    handleBut22Open=()=>{
        let modelBut22= document.getElementById('modelBut22');
        modelBut22.style.display='block';
    }
    handleBut22=(e)=>{
        let modelBut22= document.getElementById('modelBut22');
        modelBut22.style.display='none';
        this.handleResertTurn();
        this.handleBut5Open();
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
        this.handleResertTurn();
    }
    /*抽奖次数已用尽弹窗 end*/

    handleBut4Open=(prizeName)=>{
        let modelBut4= document.getElementById('modelBut4');
        let div = modelBut4.childNodes[0];
        div.children[0].innerHTML=`恭喜! 您已获得${prizeName}，请及时领取。`;
        modelBut4.style.display='block';
    }
    handleBut4= async (e)=>{
        const {winPrizeRecordId= '', prizeName='', isFirstLuckDraw} = this.state.userInfo;
        let userMobile=sessionStorage.getItem('userMobile');
        let obj={
            userMobile,
            urlChannel: 'c22',
            isFirstLuckDraw,
            prizeName,
            winPrizeRecordId,
        }
        let result = await getMyPrize(obj);
        if(result.success){
            //10元U行优惠券跳转页面到 /coupons
            if(result.prizeName === '10元U行优惠券'){
                let modelBut4= document.getElementById('modelBut4');
                modelBut4.style.display='none';
                this.handleResertTurn();
                this.handleBut2Open();
                return;
            } else if(result.prizeName === '手机' || result.prizeName === '旅行颈枕' || result.prizeName === '旅行收纳包'){
                //实物跳转到填写地址是窗口
                let modelBut4= document.getElementById('modelBut4');
                modelBut4.style.display='none';
                this.handleResertTurn();
                this.handleBut7Open();
                return;
            } else if(result.prizeName === '电子导游' || result.prizeName === '快速安检通道' || result.prizeName === '机场贵宾厅'){
                let modelBut4= document.getElementById('modelBut4');
                modelBut4.style.display='none';
                this.handleResertTurn();
                this.handleBut1Open();
                return;
            }
        }
    }

    handleBut5Open= async()=>{
        console.info('进来了');
        console.info(this.props.form.getFieldValue('userName'));
        this.props.form.resetFields(['userName','address','telPhone']);
        console.info(this.props.form.getFieldValue('userName'));
        let userMobile=sessionStorage.getItem('userMobile');
        if(!userMobile){
            userMobile='';
        }
        let result = await myPrize({
            userMobile: userMobile,
            urlChannel: 'c22',
        });
        if(typeof result.redirect !== 'undefined' && result.redirect === 'login'){
            //跳转登录页
            Toast.info('请您登录后查看奖品', 3);
            //跳转到登录页面
            setTimeout(()=>{
                this.props.history.push('/login');
            },2000);
            return;
        } else {
            this.setState({
                prizeList: result.prizeRecords,
            },()=>{
                let modelBut5= document.getElementById('modelBut5');
                modelBut5.style.display='block';
            })
        }
    }
    handleBut5=(e)=>{
        let modelBut5= document.getElementById('modelBut5');
        modelBut5.style.display='none';
        this.handleResertTurn();
    }


    handleBut6Open=(prizeName)=>{
        this.props.form.resetFields(['cardName','identityCard']);
        this.setState({time: '',});
        let modelBut6= document.getElementById('modelBut6');
        let div = modelBut6.childNodes[0];
        div.children[0].innerHTML=`恭喜!您已获得${prizeName}和价值100万的交通意外险，请及时领取`;
        const { userXingMing='', userIDNumber=''} = this.state.userInfo;
        this.props.form.setFieldsValue({
            cardName: userXingMing,
            identityCard: userIDNumber,
        });
        modelBut6.style.display='block';
    }
    handleBut6=(e)=>{
        let modelBut6= document.getElementById('modelBut6');
        modelBut6.style.display='none';
        this.handleResertTurn();
    }
    handleBut7Open=()=>{
        this.props.form.resetFields(['userName','address','telPhone']);
        let modelBut7= document.getElementById('modelBut7');
        modelBut7.style.display='block';
    }
    handleBut7=(e)=>{
        let modelBut7= document.getElementById('modelBut7');
        modelBut7.style.display='none';
        this.handleResertTurn();
    }

    handleBut77Open=()=>{
        let modelBut77= document.getElementById('modelBut77');
        modelBut77.style.display='block';
    }
    handleBut77=(e)=>{
        let modelBut77= document.getElementById('modelBut77');
        modelBut77.style.display='none';
        this.handleResertTurn();
    }
    renderPrizeList(){
        let vDOM=[];
        this.state.prizeList.forEach((item, index) => {
            let time=format(new Date(item.creatTime), 'yyyy.MM.dd');
            vDOM.push(
                <li key={Math.random()}>
                    <span>{index+1}</span>
                    <p className="Active-over-prize-p1">{item.prizeName}</p>
                    <p className="Active-over-prize-p2">--{time}--</p>
                    <a href="javascript:;" onClick={e=>{this.handleReceivePrize(e,item.winPrizeRecordId,item.prizeName)}}>领取</a>
                </li>
            );
        })
        return vDOM;
    }

    handleReceivePrize=(e,winPrizeRecordId,prizeName)=>{
        e.preventDefault();
        let userInfo = {
            winPrizeRecordId: winPrizeRecordId,
            prizeName: prizeName,
            isFirstLuckDraw: false,
        }
        this.setState({
            userInfo,
        },async ()=>{
            const {winPrizeRecordId= '', prizeName='', isFirstLuckDraw} = this.state.userInfo;
            let userMobile=sessionStorage.getItem('userMobile');
            let obj={
                userMobile,
                urlChannel: 'c22',
                isFirstLuckDraw,
                prizeName,
                winPrizeRecordId,
            }
            let result = await getMyPrize(obj);
            if(result.success){
                //10元U行优惠券跳转页面到 /coupons
                if(result.prizeName === '10元U行优惠券'){
                    this.handleBut5();
                    this.handleBut22Open();
                    return;
                } else if(result.prizeName === '手机' || result.prizeName === '旅行颈枕' || result.prizeName === '旅行收纳包'){
                    //实物跳转到填写地址是窗口
                    this.handleBut77Open();
                    return;
                } else if(result.prizeName === '电子导游' || result.prizeName === '快速安检通道' || result.prizeName === '机场贵宾厅'){
                    this.handleBut5();
                    this.handleBut11Open();
                    return;
                }
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        let luckDrawNum=sessionStorage.getItem('luckDrawNum');
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
                    {
                        luckDrawNum!=null ? (
                            <section className="active-frequency" style={{
                                position: 'relative',
                                'zIndex': 999,
                            }}>
                                <a href="javascript:;" onClick={e=>{this.handleBut5Open()}} style={{
                                    marginTop: '1rem',
                                }}>查看我的奖品</a>
                                <h2>剩余<span>{luckDrawNum?luckDrawNum:0}</span>次抽奖机会</h2>
                            </section>
                        ): ''
                    }

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
                    <section className="modal" id='modelBut11' style={{
                        display: 'none',
                    }}>
                        <div className="Active-over-wrap">
                            <p>我们将在活动结束后20个工作日内向您的手机发送电子码,请注意查收。</p>
                            <button type="button" onClick={e=>{this.handleBut11(e)}}><img src={button04} alt="" /></button>
                        </div>
                    </section>
                    <section className="modal" id='modelBut22' style={{
                        display: 'none',
                    }}>
                        <div className="Active-over-wrap">
                            <p>您获得的出行优惠券已放入手机号，登陆'U行' 即可使用。</p>
                            <button type="button" onClick={e=>{this.handleBut22(e)}}><img src={button04} alt="" /></button>
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
                        <div className="Active-prize-wrap14">
                            <p>恭喜! 您已获得机场贵宾厅权益，请及时领取。</p>
                            <button type="button" onClick={e=>{this.handleBut4(e)}}><img src={button02} alt="" /></button>
                        </div>
                    </section>
                    <section className="modal" id='modelBut5' style={{
                        display: 'none',
                    }}>
                        <div className="Active-over-prize1">
                            <ul>
                                {this.renderPrizeList()}
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
                                    })(
                                        <div>
                                            <input type="text" placeholder="姓名" />
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('address', {
                                    })(
                                        <div>
                                            <input type="text" placeholder="地址" />
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('telPhone', {
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
                    <section className="modal" id='modelBut77' style={{
                        display: 'none',
                    }}>
                        <div className="Active-prize-wrap13" style={{
                            height: '19.5rem',
                        }}>
                            <p>请填写收货信息,我们将在活动结束后20个工作日内为您寄送奖品。</p>
                            <Form onSubmit={this.handleAwardSubmit1}>
                                <FormItem>
                                    {getFieldDecorator('userName', {
                                    })(
                                        <div>
                                            <input type="text" placeholder="姓名" />
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('address', {
                                    })(
                                        <div>
                                            <input type="text" placeholder="地址" />
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('telPhone', {
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
export default (Form.create()(RotaryDraw));