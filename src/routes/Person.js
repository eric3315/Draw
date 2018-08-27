import React from 'react';
import {connect} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './person/Login';
import Info from './person/Info';
import Tip from './person/Tip';
import Register from './person/Register';

import { checkLogin } from '../api/personApi';
import '../static/css/person.less';


class Person extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={
            isLogin: false,
        }
    }
    async componentDidMount(){
      let result = await checkLogin(),
          isLogin = parseFloat(result.code) === 0 ? true :false;
      this.setState({
         isLogin,
      })
    }
    /*
    * 当路由切换的时候，对应的组件会重新渲染，但是渲染也要分情况
    *  1. 之前渲染其他组件的时候把当前组件彻底从页面中移除了，再次渲染当前组件，走的是挂载的流程   （从头开始走）
    *  2. 如果当前组件没有彻底在页面中移除（本组件内部的子组件在切换），每一次走的是更新的流程，不是重新挂载的流程
    *
    * */
    async componentWillReceiveProps(){
        let result = await checkLogin(),
            isLogin = parseFloat(result.code) === 0 ? true :false;
        this.setState({
            isLogin,
        })
    }

    render(){
        return (
            <section>
                <Switch>
                    {/*render 权限校验*/}
                    {/*路由的验证和渲染是同步的， 不容许在校验中出现异常*/}
                    {/*<Route path='/person/info' render={async ()=>{*/}
                        {/*let result = await checkLogin();*/}
                        {/*if(parseFloat(result.code ) === 0){*/}
                            {/*return <Info/>*/}
                        {/*}*/}
                        {/*return <Tip/>;*/}
                    {/*}}/>*/}
                    {/*基于render返回的组件不受路由管控的组件*/}
                    <Route path='/person/info' render={()=>{
                        if(this.state.isLogin){
                            return <Info/>;
                        }
                        return <Tip/>;
                    }}/>
                    <Route path='/person/login' component={Login}/>
                    <Route path='/person/register' component={Register}/>
                    <Redirect from='/person' to='/person/info' />
                </Switch>
            </section>
        )
    }
}

export default connect()(Person);