import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'antd';
import Qs from 'qs';
import {info} from '../../api/courseApi';


class Info extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
            infoData: null,
        }

    }
    async componentDidMount(){
        let {location: {search}} =this.props,
            {courseId = 0 } = Qs.parse(search.substr(1)) || {};
        let result = await info(courseId);
        if(parseFloat(result.code) === 0){
            this.setState({
                infoData: result.data,
            })
        }
    }

    render(){
        let {infoData} =this.state;
        if(!infoData) return '';
        return (
            <div className='baseInfo'>
                <video src='http://220.194.121.22/vlive.qqvideo.tc.qq.com/A4xFObSna9R9BCHlj8Rc1FopTBXg2tFKbTj9OQWsjCHk/k0200hee7bb.p202.1.mp4?vkey=CB19122BDD31A398AD86E994E24989117184368BE7A736FED6C100B27B1DC651464477F8175D38EFF94DB4B6355985534557806FFCA29170D0B8A15317ED4C34D0C456476E8EFF297D26D9AF1502565DA86314B6C15C6D8D78E59535C1FBAA89FA76C4EE1210E6AB5B07E128BC2844A9D1F1AC68AE9271EB&platform=4100201&sdtfrom=&fmt=hd&level=0&locid=6e09f484-d99f-42c1-90d9-6017e097a34d&size=1134989&ocid=276501676
' controls preload='none' poster={infoData.pic}/>
                <div className='content'>
                    <h3>{infoData.name}</h3>
                    <p>{infoData.dec}</p>
                    <span>课程价格：{infoData.price}</span>
                    <Button type='dashed'>立即购买</Button>
                </div>
            </div>
        )
    }
}

export default connect()(Info);