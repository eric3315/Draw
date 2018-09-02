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
        let userMobile=sessionStorage.getItem('userMobile');
        if(!userMobile){
            userMobile='';
        }
        if(userMobile=='') return '';
        return (
            <header className="Active-header" id="Active-header">
                <a href="javascript:;"><img src={close01} alt=""/></a>
                <span>{userMobile}</span>
                <img src={person} alt=""/>
            </header>
        )
    }
}
export default Top;