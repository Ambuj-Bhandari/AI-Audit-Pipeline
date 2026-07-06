import React from "react";
import AuditApi from "./api/AuditApi.js";
import AuditDashboard from './components/AuditDashboard.jsx';

export default class App extends React.Component{
    constructor(props){
        super(props);
        this.api = new AuditApi();
    }
    
    render() {
        return <AuditDashboard api={this.api}/>;
    }
}