import React from 'react';
import person from '../static/images/person.png';
import close01 from'../static/images/close01.png';

class Top extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state={

        }
    }

    componentDidMount(){
    }

    render(){
        return (
            <header className="Active-header" id="Active-header">
                <a href="javascript:;"><img src={close01} alt=""/></a>
                <span>185****8217</span>
                <img src={person} alt=""/>
            </header>
        )
    }
}
export default Top;