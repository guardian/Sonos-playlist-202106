import {h, Component, Fragment} from "preact";
import Section from "./Section";
import store from "./store";
import {Provider, useSelector} from 'react-redux';

const Brother = () => {
    const sections = useSelector(s => s.data.sections);
    
    const list = sections.map((v,i)=>{
        return <Section {...v}></Section>;
    });    
    return (
        <Fragment>
            {list}
            
        </Fragment>
    )
}

export default function () {
    return (<Provider  store={store} ><Brother/></Provider>)
};