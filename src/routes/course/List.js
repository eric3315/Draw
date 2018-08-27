import React from 'react';
import {connect} from 'react-redux';
import { Carousel, Icon, Button } from 'antd';
import {Link} from 'react-router-dom';
import action from '../../store/action';

class List extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
            isLoading: false,
        }

    }

    componentDidMount(){
        let {bannerList, queryBanner, courseList, queryList} = this.props;
        if(!bannerList || bannerList.length === 0){
            queryBanner();
        }
        if(courseList.data.length === 0){
            queryList();
        }
    }

    queryType=()=>{
        let {courseType} = this.props,
            text='全部课程';
        switch (courseType) {
            case 'react':
                text='REACT框架开发课程';
                break;
            case 'vue':
                text='VUE框架开发课程';
                break;
            case 'xiaochengxu':
                text='小程序开发课程';
                break;
        }
        return text;
    }
    loadMore=()=>{
        if(this.state.isLoading) return;
        this.setState({
            isLoading: true,
        });
        let {courseList, queryList, courseType} = this.props;
        queryList({
            page: courseList.page + 1,
            type: courseType,
            flag: 'push',
        });
    }

    componentWillReceiveProps(){
        //当触发这个函数时，说明传递给组件的属性改变了（1.路由重新渲染或者redux中的状态改变了）
        this.setState({
            isLoading: false,
        });

    }

    render(){
        let {bannerList, courseList} =this.props,
            { data } = courseList;
        return (
            <div className='listBox'>

                {
                    bannerList && bannerList.length!==0
                        ?
                        (
                            <Carousel autoplay>
                                {
                                    bannerList.map((item,index)=>{
                                        let {name, pic} = item;
                                        return <div key={index}>
                                            <img src={pic} alt={name} />
                                        </div>
                                    })
                                }
                            </Carousel>
                        )
                        :
                        ''
                }
                {/*数据列表*/}
                <div className='courseList'>
                    <h2><Icon type="menu-fold" />{this.queryType()}</h2>
                    {
                        data && data.length!==0
                            ?
                            (
                                <div>
                                    <ul>
                                        {
                                            data.map((item,index)=>{
                                                let {pic,name,dec,id,time} =item;
                                                return  <li key={index}>
                                                    <Link to={{
                                                        pathname: '/course/info',
                                                        search: `courseId=${id}`
                                                    }}>
                                                        <h3>{name}</h3>
                                                        <div className='content'>
                                                            <div className='pic'>
                                                                <img src={pic} alt={name}/>
                                                            </div>
                                                            <div className='desc'>
                                                                <p>{dec}</p>
                                                                <p>时间：{time}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            })
                                        }

                                    </ul>
                                    {
                                        courseList.total <= courseList.page ? '' : (
                                            <Button type="dashed" onClick={this.loadMore} loading={this.state.isLoading}>加载更多</Button>
                                        )
                                    }

                                </div>
                            ) : '暂无数据'
                    }
                </div>
            </div>
        )
    }
}

export default connect(state=>({...state.course}), action.course)(List);