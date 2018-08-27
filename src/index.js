import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

/*ANTD*/
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

/*IMPORT CSS*/
import './static/css/reset.min.css';
import './static/css/index.css';

/*IMPORT COMPONENT*/
import Login from './routes/Login';
import FirstPrize from './routes/FirstPrize';


render(
        <Router>
            <LocaleProvider locale={zh_CN}>
                <div>
                    <main className='container'>
                        <Switch>
                            <Route path='/login' component={Login} />
                            <Route path='/firstPrize' component={FirstPrize} />
                            <Redirect from="/" to='/login'/>
                        </Switch>
                    </main>
                </div>
            </LocaleProvider>
        </Router>
    ,document.getElementById("root"));
