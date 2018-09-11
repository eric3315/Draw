import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
/*REDUX STORE*/
import {Provider} from 'react-redux';
import store from './store';

/*ANTD*/
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

/*IMPORT CSS*/
import './static/css/reset.min.css';
import './static/css/index.css';

/*IMPORT COMPONENT*/
import Login from './routes/Login';/*登录*/
import RotaryDraw from './routes/RotaryDraw';/*转盘抽奖*/

moment.locale('en');

function checkAuth(){
   console.info('进来了');
}

render(
    <Provider store={store}>
        <Router>
            <LocaleProvider locale={zh_CN}>
                <div>
                    <main className='container'>
                        <Switch>
                            <Route path='/login' component={Login} />
                            <Route path='/rotaryDraw' component={RotaryDraw} />
                            <Redirect from="/" to='/rotaryDraw'/>
                        </Switch>
                    </main>
                </div>
            </LocaleProvider>
        </Router>
    </Provider>
,document.getElementById("root"));
