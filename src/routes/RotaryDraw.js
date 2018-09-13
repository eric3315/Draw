import React from 'react';
import Top from '../component/Top';
import logo2 from '../static/images/logo2.png';
import table from '../static/images/table.png';
import button04 from '../static/images/button04.png';
import button02 from '../static/images/button02.png';
import chassis from '../static/images/chassis.png';
import pointer from '../static/images/pointer.png';
import turn from '../static/images/turn.png';
import {Toast, Modal} from'antd-mobile';
import {luckDraw, getMyPrize, myPrize, getRecAddr, getRecInsurance, getLuckDrawNumber} from '../api/serverAPi';
import InsuranceForm from '../component/InsuranceForm';
import InformationForm from '../component/InformationForm';
import OtherForm from '../component/OtherForm';
import OtherInformationForm from '../component/OtherInformationForm';
import {format,queryURLParameter} from '../utils/utils';

const alert = Modal.alert;
let rotateArr = [25.7,77.1,128.5,180,231.4,283,334];

class RotaryDraw extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
            isRotate: true,
            drawFlag: true,
            insuranceFlag: false,
            informationFlag: false,
            otherInsuranceFlag: false,
            otherInformationFlag: false,
            prizeListFlag: false,
            modelBut1Flag: false,
            modelBut2Flag: false,
            modelBut11Flag: false,
            modelBut22Flag: false,
            modelBut3Flag: false,
            modelBut4Flag: false,
            urlChannel: '',
            luckDrawFLag: false,
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
    async componentDidMount(){
        let obj = queryURLParameter(window.location.href);
        let userMobile=sessionStorage.getItem('userMobile');
        if(typeof obj.urlChannel!=='undefined'){
            this.setState({urlChannel: obj.urlChannel});
        }
        if(userMobile){
            let result = await getLuckDrawNumber({
                userMobile: userMobile,
                urlChannel: obj.urlChannel,
            });
            console.info(JSON.stringify(result));
            if(result.success){
                //更新抽奖次数
                sessionStorage.setItem('luckDrawNum',result.luckDrawNum);
                this.setState({
                    luckDrawFLag: !this.state.luckDrawFLag
                })
            }
        }
    }
    handleRotating= (e)=>{
        e.preventDefault();
        if(this.state.isRotate){
            this.setState({
                isRotate: false,
            },async ()=>{
                let userMobile=sessionStorage.getItem('userMobile');
                let luckDrawNum=sessionStorage.getItem('luckDrawNum');
                if(!userMobile){
                    userMobile='';
                }
                if(luckDrawNum == null || luckDrawNum > 0){
                    let result = await luckDraw({
                        userMobile: userMobile,
                        urlChannel: this.state.urlChannel,
                    });
                    if(result.success){
                        if(typeof result.redirect !== 'undefined' && result.redirect === 'login'){
                            this.setState({isRotate: true});
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
                                            winPrizeRecordId: result.winPrizeRecordId,
                                            userXingMing: result.userXingMing,
                                            userIDNumber: result.userIDNumber,
                                            prizeName: result.prizeName,
                                            isFirstLuckDraw: result.isFirstLuckDraw,
                                        }
                                    } else {
                                        userInfo = {
                                            winPrizeRecordId: result.winPrizeRecordId,
                                            userXingMing: '',
                                            userIDNumber: '',
                                            prizeName: result.prizeName,
                                        }
                                    }
                                    this.setState({
                                        userInfo,
                                        insuranceFlag: true,
                                    })
                                } else {
                                    userInfo = {
                                        winPrizeRecordId: result.winPrizeRecordId,
                                        prizeName: result.prizeName,
                                        isFirstLuckDraw: result.isFirstLuckDraw,
                                    }
                                    this.setState({
                                        userInfo,
                                    })
                                    this.handleBut4Open(result.prizeName);
                                }
                                this.setState({isRotate: true});
                                return;
                            },3000);
                        }
                    } else {
                        this.setState({isRotate: true});
                        Toast.info(result.messageTip, 3);
                        return;
                    }
                } else if(luckDrawNum == 0){
                    //抽奖次数已用尽
                    this.setState({isRotate: true});
                    this.handleBut3Open();
                    return;
                }
            })
        }

    }

    handleFirstPrizeSubmit= async (cardName,identityCard,time) => {
        const {winPrizeRecordId= '', userXingMing='', userIDNumber='', prizeName='', isFirstLuckDraw} = this.state.userInfo;
        let userMobile=sessionStorage.getItem('userMobile');
        let obj={};
        if(userXingMing && userIDNumber){
            obj={
                userMobile,
                urlChannel: this.state.urlChannel,
                isFirstLuckDraw,
                prizeName,
                winPrizeRecordId,
                insuranceXiMing: userXingMing,
                insuranceIDNumber: userIDNumber,
                insuranceEffectTime: time,
            }
        } else {
            obj={
                userMobile,
                urlChannel: this.state.urlChannel,
                isFirstLuckDraw,
                prizeName,
                winPrizeRecordId,
                insuranceXiMing: cardName,
                insuranceIDNumber: identityCard,
                insuranceEffectTime: time,
            }
        }
        let result = await getMyPrize(obj);
        if(result.success){
            //10元U行优惠券跳转页面到 /coupons
            if(result.prizeName === '10元U行优惠券'){
                this.setState({insuranceFlag: false},()=>{
                    Toast.info('您的交通意外险已投保成功，请注意查收短信', 2);
                    this.handleBut2Open();
                });
                return;
            } else if(result.prizeName === '手机' || result.prizeName === '旅行颈枕' || result.prizeName === '旅行收纳包'){
                //实物跳转到填写地址是窗口
                this.setState({insuranceFlag: false},()=>{
                    Toast.info('您的交通意外险已投保成功，请注意查收短信', 2);
                    this.setState({informationFlag: true});
                });
                return;
            } else if(result.prizeName === '电子导游' || result.prizeName === '快速安检通道' || result.prizeName === '机场贵宾厅'){
                this.setState({insuranceFlag: false},()=>{
                    Toast.info('您的交通意外险已投保成功，请注意查收短信', 2);
                    this.handleBut1Open();
                });
                return;
            }
        } else {
            Toast.info(result.messageTip, 3);
            return;
        }
    }

    handleAwardSubmit = async (userName,address,telPhone) => {
        //正常提交领取奖品
        const {winPrizeRecordId= '', prizeName='',} = this.state.userInfo;
        let userMobile=sessionStorage.getItem('userMobile');
        let obj={
            userMobile,
            urlChannel: this.state.urlChannel,
            prizeName,
            winPrizeRecordId,
            addrXiming: userName,
            addr: address,
            addrContactMobile: telPhone,
        }
        alert('', '亲，提交后就不能修改了哦', [
            { text: '返回', onPress: () => console.log('cancel') },
            { text: '确认', onPress: async () => {
                    let result = await getRecAddr(obj);
                    if(result.success){
                        this.handleResertTurn();
                        this.setState({informationFlag: false});
                    } else {
                        Toast.info(result.messageTip, 2);
                        return;
                    }
                }},
        ])
    }

    handleResertTurn=()=>{
        let turnId = document.getElementById('turnId');
        turnId.style.transform = "rotate(0deg)";
    }
    /*其他电子码弹窗 begin*/
    handleBut1Open=()=>{
        this.setState({
            modelBut1Flag: true,
        })
    }
    handleBut1=()=>{
        this.setState({
            modelBut1Flag: false,
        },()=>{
            this.handleResertTurn();
        })
    }
    handleModelBut1Close=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.setState({
                modelBut1Flag: false,
            },()=>{
                this.handleResertTurn();
            })
        }
    }
    /*其他电子码弹窗 begin*/

    /*U行优惠券弹窗 begin*/
    handleBut2Open=()=>{
        this.setState({
            modelBut2Flag: true,
        })
    }
    handleBut2=(e)=>{
        this.setState({
            modelBut2Flag: false,
        },()=>{
            this.handleResertTurn();
        })
    }
    handleModelBut2Close=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.setState({
                modelBut2Flag: false,
            },()=>{
                this.handleResertTurn();
            })
        }
    }

    /*其他电子码弹窗 begin*/
    handleBut11Open=()=>{
        this.setState({
            modelBut11Flag: true,
        })
    }
    handleBut11=(e)=>{
        this.setState({
            modelBut11Flag: false,
        },()=>{
            this.handleResertTurn();
            this.handleBut5Open();
        })
    }
    handleModelBut11Close=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.setState({
                modelBut11Flag: false,
            },()=>{
                this.handleResertTurn();
                this.handleBut5Open();
            })
        }
    }
    /*其他电子码弹窗 begin*/

    /*U行优惠券弹窗 begin*/
    handleBut22Open=()=>{
        this.setState({
            modelBut22Flag: true,
        })
    }
    handleBut22=(e)=>{
        this.setState({
            modelBut22Flag: false,
        },()=>{
            this.handleResertTurn();
            this.handleBut5Open();
        })
    }

    handleModelBut22Close=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.setState({
                modelBut22Flag: false,
            },()=>{
                this.handleResertTurn();
                this.handleBut5Open();
            })
        }
    }

    /*U行优惠券弹窗 end*/

    /*抽奖次数已用尽弹窗 begin*/
    handleBut3Open=()=>{
        this.setState({
            modelBut3Flag: true,
        })
    }
    handleBut3=(e)=>{
        this.setState({
            modelBut3Flag: false,
        },()=>{
            this.handleResertTurn();
        })
    }
    handleModelBut3Close=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.setState({
                modelBut3Flag: false,
            },()=>{
                this.handleResertTurn();
            })
        }
    }
    /*抽奖次数已用尽弹窗 end*/

    handleBut4Open=(prizeName)=>{
        this.setState({
            modelBut4Flag: true,
        },()=>{
            let modelBut4= document.getElementById('modelBut4');
            let div = modelBut4.childNodes[0];
            div.children[0].innerHTML=`恭喜! 您已获得${prizeName}，请及时领取。`;
        })
    }

    handleModel4Close=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.setState({
                modelBut4Flag: false,
            },()=>{
                this.handleResertTurn();
            })
        }
    }

    handleBut4= async (e)=>{
        const {winPrizeRecordId= '', prizeName='', isFirstLuckDraw} = this.state.userInfo;
        let userMobile=sessionStorage.getItem('userMobile');
        let obj={
            userMobile,
            urlChannel: this.state.urlChannel,
            isFirstLuckDraw,
            prizeName,
            winPrizeRecordId,
        }
        let result = await getMyPrize(obj);
        if(result.success){
            //10元U行优惠券跳转页面到 /coupons
            if(result.prizeName === '10元U行优惠券'){
                this.setState({
                    modelBut4Flag: false,
                },()=>{
                    this.handleResertTurn();
                    this.handleBut2Open();
                })
                return;
            } else if(result.prizeName === '手机' || result.prizeName === '旅行颈枕' || result.prizeName === '旅行收纳包'){
                //实物跳转到填写地址是窗口
                this.setState({
                    modelBut4Flag: false,
                    informationFlag: true
                },()=>{
                    this.handleResertTurn();
                })
                return;
            } else if(result.prizeName === '电子导游' || result.prizeName === '快速安检通道' || result.prizeName === '机场贵宾厅'){
                this.setState({
                    modelBut4Flag: false,
                },()=>{
                    this.handleResertTurn();
                    this.handleBut1Open();
                })
                return;
            }
        }
    }

    handleBut5Open= async()=>{
        let userMobile=sessionStorage.getItem('userMobile');
        if(!userMobile){
            userMobile='';
        }
        let result = await myPrize({
            userMobile: userMobile,
            urlChannel: this.state.urlChannel,
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
            if(typeof result.prizeRecords!=='object'){
                Toast.info(result.messageTip, 3);
            } else {
                this.setState({
                    prizeList: result.prizeRecords,
                    prizeListFlag: true,
                })
            }
        }
    }
    handleBut5=(e)=>{
        if(e.target.tagName === 'SECTION'){
            this.setState({prizeListFlag: false},()=>{
                this.handleResertTurn();
            })
        }
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
                    {
                        item.isReceivedPrize === 1
                        ?
                        (
                          <a href="javascript:;">已领取</a>
                        )
                        : <a href="javascript:;" onClick={e=>{this.handleReceivePrize(e,item)}}>领取</a>
                    }
                </li>
            );
        })
        return vDOM;
    }

    handleReceivePrize=(e,item)=>{
        e.preventDefault();
        let userInfo={};
        userInfo = {
            winPrizeRecordId: item.winPrizeRecordId,
            prizeName: item.prizeName,
            isFirstLuckDraw: false,
        }
        this.setState({
            userInfo,
        },async ()=>{
            const {winPrizeRecordId= '', prizeName='', isFirstLuckDraw} = this.state.userInfo;
            let userMobile=sessionStorage.getItem('userMobile');
            let obj={
                userMobile,
                urlChannel: this.state.urlChannel,
                isFirstLuckDraw,
                prizeName,
                winPrizeRecordId,
            }
            let result = await getMyPrize(obj);
            if(result.success){
                //10元U行优惠券跳转页面到 /coupons
                if(result.prizeName === '10元U行优惠券'){
                    this.setState({prizeListFlag: false},()=>{
                        this.handleBut22Open();
                    })
                    return;
                } else if(result.prizeName === '手机' || result.prizeName === '旅行颈枕' || result.prizeName === '旅行收纳包'){
                    //实物跳转到填写地址是窗口
                    this.setState({prizeListFlag: false},()=>{
                        this.setState({otherInformationFlag: true});
                    })
                    return;
                } else if(result.prizeName === '电子导游' || result.prizeName === '快速安检通道' || result.prizeName === '机场贵宾厅'){
                    this.setState({prizeListFlag: false},()=>{
                        this.handleBut11Open();
                    })
                    return;
                } else if(result.prizeName === '交通意外险'){
                    userInfo={
                        winPrizeRecordId: result.winPrizeRecordId,
                        prizeName: result.prizeName,
                        isFirstLuckDraw: result.isFirstLuckDraw,
                        userXingMing: result.userXingMing,
                        userIDNumber: result.userIDNumber,
                    }
                    this.setState({userInfo},()=>{
                        this.setState({otherInsuranceFlag: true});
                    })
                }
            } else {
                Toast.info(result.messageTip, 2);
                return;
            }
        })
    }

    handleOtherInsuranceSubmit= async (insuranceXiMing, insuranceIDNumber, insuranceEffectTime)=>{
        const {winPrizeRecordId= '', userXingMing='', userIDNumber='', prizeName='', isFirstLuckDraw} = this.state.userInfo;
        let userMobile=sessionStorage.getItem('userMobile');
        let obj={};
        if(userXingMing && userIDNumber){
            obj={
                userMobile,
                urlChannel: this.state.urlChannel,
                winPrizeRecordId,
                prizeName,
                insuranceXiMing: userXingMing,
                insuranceIDNumber: userIDNumber,
                insuranceEffectTime,
            }
        } else {
            obj={
                userMobile,
                urlChannel: this.state.urlChannel,
                isFirstLuckDraw,
                prizeName,
                winPrizeRecordId,
                insuranceXiMing,
                insuranceIDNumber,
                insuranceEffectTime,
            }
        }
        let result = await getRecInsurance(obj);
        if(result.success){
            Toast.info('您的交通意外险已投保成功，请注意查收短信', 2);
            this.setState({otherInsuranceFlag: false},()=>{
                this.handleBut5Open();
            });
        } else {
            Toast.info(result.messageTip, 2);
        }
    }

    handleOtherAwardSubmit = async (userName,address,telPhone) => {
        //正常提交领取奖品
        const {winPrizeRecordId= '', prizeName='',} = this.state.userInfo;
        let userMobile=sessionStorage.getItem('userMobile');
        let obj={
            userMobile,
            urlChannel: this.state.urlChannel,
            prizeName,
            winPrizeRecordId,
            addrXiming: userName,
            addr: address,
            addrContactMobile: telPhone,
        }
        alert('', '亲，提交后就不能修改了哦', [
            { text: '返回', onPress: () => console.log('cancel') },
            { text: '确认', onPress: async () => {
                    let result = await getRecAddr(obj);
                    if(result.success){
                        this.setState({otherInformationFlag: false},()=>{
                            console.info('进来了');
                            this.handleBut5Open();
                        });
                    } else {
                        Toast.info(result.messageTip, 2);
                        return;
                    }
                }},
        ])
    }

    handleHideInsurance=()=>{
        this.setState({insuranceFlag: false});
    }
    handleHideInformation=()=>{
        this.setState({informationFlag: false});
    }
    handleHideOtherInsurance=()=>{
        this.setState({otherInsuranceFlag: false});
    }
    handleHideOtherInformation=()=>{
        this.setState({otherInformationFlag: false});
    }
    render(){
        let luckDrawNum=sessionStorage.getItem('luckDrawNum');
        return (
            <div>
                <Top/>
                <main className="Active-main" id="Active-main" style={{
                    height: 'auto'
                }}>
                    <section className="Active-main-logo">
                        <img src={logo2} alt="" />
                    </section>
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
                            <p>(1)本次活动奖品由太平保险提供；</p>
                            <p>(2)活动时间：2018年9月15日至2018年11月30日；</p>
                            <p>(3)活动期间用户拨打114/116114电话查询或预定产品可获得抽奖机会，关注U行公众号可获得1次抽奖机会，具体兑换规则如下：</p>
                            <img src={table} alt="" />
                            <p>
                                (4)用户获得奖品后需前往领奖页面，依据领奖流程填写个人信息后领取；
                            </p>
                            <p>
                                (5)如参与抽奖的手机号未注册过U行账户，需同意<strong>U行服务条款、隐私政策</strong>和<strong>太平金服服务协议</strong>注册成为U行和太平金服会员后可参与本活动；
                            </p>
                            <p>
                                (6)同一用户不可重复参加本活动，同一用户指与用户身份相关信息（如手机号、身份证号、U行账号、终端设备等），其中任意一项或多项存在相同或非真实有效等情况时，均可能被认定为同一用户，并按同一用户规则处理；
                            </p>
                            <p>
                                (7)如享受抽奖资格的订单发生退款或取消订单，将退还用户实际支付的金额，抽奖资格后续不予补发；
                            </p>
                            <p>
                                (8)在本活动期间，如存在违规行为（包括但不限于恶意套取资金、机器作弊、虚假交易等违反诚实信用原则行为），主办方将取消您的中奖资格，并有权撤销相关违规交易和奖励，必要时追究法律责任；
                            </p>
                            <p>
                                (9)如出现不可抗力或情势变更的情况（包括但不限于重大灾害事件、活动受政府机关指令需要停止举办或调整的、活动遭受严重网络攻击或因系统故障需要暂停举办的），主办方有权暂停或取消本次活动，并可依相关法律法规的规定主张免责；
                            </p>
                            <p>
                                (10)活动最终解释权归U行所有。如需进一步了解活动规则，请咨询客服电话114。
                            </p>
                        </div>
                    </section>
                    {
                        this.state.modelBut1Flag
                        ?
                        (
                            <section className="modal" id='modelBut1' onClick={e=>{this.handleModelBut1Close(e)}}>
                                <div className="Active-over-wrap">
                                    <p>我们将在活动结束后20个工作日内向您的手机发送电子码,请注意查收。</p>
                                    <button type="button" onClick={e=>{this.handleBut1()}}><img src={button04} alt="" /></button>
                                </div>
                            </section>
                        ):''
                    }
                    {
                        this.state.modelBut2Flag
                        ?
                        (
                            <section className="modal" id='modelBut2' onClick={e=>{this.handleModelBut2Close(e)}}>
                                <div className="Active-over-wrap">
                                    <p>您获得的出行优惠券已放入手机号，登陆'U行' 即可使用。</p>
                                    <button type="button" onClick={e=>{this.handleBut2(e)}}><img src={button04} alt="" /></button>
                                </div>
                            </section>
                        ):''
                    }
                    {
                        this.state.modelBut11Flag
                        ?
                        (  <section className="modal" id='modelBut11' onClick={e=>{this.handleModelBut11Close(e)}}>
                            <div className="Active-over-wrap">
                                <p>我们将在活动结束后20个工作日内向您的手机发送电子码,请注意查收。</p>
                                <button type="button" onClick={e=>{this.handleBut11(e)}}><img src={button04} alt="" /></button>
                            </div>
                        </section>
                        ):''
                    }
                    {
                        this.state.modelBut22Flag
                            ?
                            (  <section className="modal" id='modelBut22' onClick={e=>{this.handleModelBut22Close(e)}}>
                                    <div className="Active-over-wrap">
                                        <p>您获得的出行优惠券已放入手机号，登陆'U行' 即可使用。</p>
                                        <button type="button" onClick={e=>{this.handleBut22(e)}}><img src={button04} alt="" /></button>
                                    </div>
                                </section>
                            ):''
                    }
                    {
                        this.state.modelBut3Flag
                            ?
                            (  <section className="modal" id='modelBut3' onClick={e=>{this.handleModelBut3Close(e)}}>
                                    <div className="Active-over-wrap">
                                        <h2>抱歉</h2>
                                        <p style={{
                                            lineHeight: '2.5rem',
                                        }}>您的抽奖次数已用尽</p>
                                        <button type="button" onClick={e=>{this.handleBut3(e)}}><img src={button04} alt="" /></button>
                                    </div>
                                </section>
                            ):''
                    }
                    {
                        this.state.modelBut4Flag
                           ?
                            (
                                <section className="modal" id='modelBut4' onClick={e=>{this.handleModel4Close(e)}}>
                                <div className="Active-prize-wrap14">
                                    <p>恭喜! 您已获得***，请及时领取。</p>
                                    <button type="button" onClick={e=>{this.handleBut4(e)}}><img src={button02} alt="" /></button>
                                </div>
                            </section>
                            ):''
                    }
                    {
                        this.state.prizeListFlag
                        ?
                        (
                            <section className="modal" id='modelBut5' onClick={e=>{this.handleBut5(e)}}>
                                <div className="Active-over-prize1">
                                    <ul>
                                        {this.renderPrizeList()}
                                    </ul>
                                </div>
                            </section>
                        ): ''
                    }
                    {
                        this.state.insuranceFlag
                            ?
                            (<InsuranceForm
                                userInfo={this.state.userInfo}
                                handleFirstPrizeSubmit={this.handleFirstPrizeSubmit}
                                handleHideInsurance ={this.handleHideInsurance}
                            />)
                            : ''
                    }
                    {
                        this.state.informationFlag
                           ?
                            (<InformationForm
                                handleAwardSubmit={this.handleAwardSubmit}
                                handleHideInformation ={this.handleHideInformation}
                            />)
                            :''
                    }
                    {
                        this.state.otherInsuranceFlag
                            ?
                            (<OtherForm
                                userInfo={this.state.userInfo}
                                handleOtherInsuranceSubmit={this.handleOtherInsuranceSubmit}
                                handleHideOtherInsurance ={this.handleHideOtherInsurance}
                            />)
                            :''
                    }
                    {
                        this.state.otherInformationFlag
                            ?
                            (<OtherInformationForm
                                handleOtherAwardSubmit={this.handleOtherAwardSubmit}
                                handleHideOtherInformation ={this.handleHideOtherInformation}
                            />)
                            :''
                    }
                </main>
            </div>
        )
    }
}
export default RotaryDraw;