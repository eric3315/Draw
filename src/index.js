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
import FirstPrize from './routes/FirstPrize';/*首次获奖*/
import FirstPrizeOne from './routes/FirstPrizeOne';/*首次获奖*/
import PrizeAddress from './routes/PrizeAddress';/*实物奖品填写地址*/
import LookPrize from './routes/LookPrize';/*查看奖品*/
import VirtualPrize from  './routes/VirtualPrize';/*虚拟奖品*/
import Coupons from  './routes/Coupons';/*优惠券*/
import NumberFinished from  './routes/NumberFinished';/*次数用尽*/
import RotaryDraw from './routes/RotaryDraw';/*转盘抽奖*/

moment.locale('en');
render(
    <Provider store={store}>
    <Router>
            <LocaleProvider locale={zh_CN}>
                <div>
                    <main className='container'>
                        <Switch>
                            <Route path='/login' component={Login} />
                            <Route path='/firstPrize' component={FirstPrize} />
                            <Route path='/firstPrizeOne' component={FirstPrizeOne} />
                            <Route path='/prizeAddress' component={PrizeAddress} />
                            <Route path='/lookPrize' component={LookPrize} />
                            <Route path='/rotaryDraw' component={RotaryDraw} />
                            <Redirect from="/" to='/rotaryDraw'/>
                        </Switch>
                    </main>
                </div>
            </LocaleProvider>
        </Router>
    </Provider>
,document.getElementById("root"));
