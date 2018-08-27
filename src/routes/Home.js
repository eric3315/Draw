import React from 'react';
import {Switch, Route, Redirect } from 'react-router-dom';
import List from './course/List';
import Info from './course/Info';
import '../static/css/course.less';

export default class Home extends React.Component{
    render(){
        return (
            <section className='courseBox'>
                <Switch>
                    <Route path='/course' exact component={List}/>
                    <Route path='/course/info' component={Info} />
                    <Redirect to='/course'/>
                </Switch>
            </section>
        )
    }
};