import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Icon} from 'antd';
import action from '../store/action';

/*TRANSITION*/
import Transition from 'react-transition-group/Transition';

const duration = 300,
      defaultStyle = {
        transition: `opacity ${duration}ms`,
        opacity: 0,
        zIndex: -1,
      },
      transitionStyles = {
        entering: { opacity: 0, zIndex: -1 },
        entered:  { opacity: 1, zIndex: 9999 },
      };

class NavTop extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
            in: false,
        }
    }
    handleShow=()=>{
        this.setState({
            in: !this.state.in,
        })
    }
    handleClick=(e)=>{
        let target = e.target,
            tarTag = target.tagName;
        if(tarTag === 'LI'){
            let {queryList} =this.props;
            queryList({
                page: 1,
                type: target.getAttribute('type'),
                flag: 'replace',
            });
            this.setState({
                in: false,
            })
        }
    }
    render(){
        return (
            <header className='headerNavBox'>
                {/*首页导航*/}
                <div className='homeBox'>
                    <div className='baseBox'>
                        <h1 className='logo'>珠峰培训</h1>
                        <Icon type="bars" className='icon' style={{fontSize: '.6rem'}} onClick={this.handleShow}/>
                    </div>
                    <Transition in={this.state.in} timeout={0}>
                        {
                            state => {
                                return <ul className='filterBox' style={{
                                    ...defaultStyle,
                                    ...transitionStyles[state],

                                    display: this.state.in ? 'block' : 'none'
                                }} onClick={(e)=>{this.handleClick(e)}}>
                                    <li type="all">全部课程</li>
                                    <li type="react">REACT课程</li>
                                    <li type="vue">VUE课程</li>
                                    <li  type="xiaochengxu">小程序课程</li>
                                </ul>
                            }
                        }
                    </Transition>
                </div>
            </header>
        )
    }
}

export default withRouter(connect(null,action.course)(NavTop));