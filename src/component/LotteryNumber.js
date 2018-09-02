import React from 'react';
import {myPrize} from '../api/serverAPi';
import {Toast} from'antd-mobile';

class LotteryNumber extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={

        }
    }

    componentDidMount(){
    }

    handleMyPrize= async(e)=>{
        e.preventDefault();
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
            //跳转到查看我的奖品页
            console.info(JSON.stringify(result));
        }
    }

    render(){
        let luckDrawNum=sessionStorage.getItem('luckDrawNum');
        if(luckDrawNum==null) return '';
        return (
            <section className="active-frequency" style={{
                position: 'relative',
                'zIndex': 999,
            }}>
                <a href="javascript:;" onClick={e=>{this.handleMyPrize(e)}} style={{
                    marginTop: '1rem',
                }}>查看我的奖品</a>
                <h2>剩余<span>{luckDrawNum?luckDrawNum:0}</span>次抽奖机会</h2>
            </section>
        )
    }
}
export default LotteryNumber;