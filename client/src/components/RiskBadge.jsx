import React from "react";

export default class RiskBadge extends React.Component{
    render(){
        const { severity, score } = this.props;
        if(!severity){
            return <span className="badge bg-secondary">pending</span>;
        }

        const cls = `badge badge-risk-${severity}`;
        const label = typeof score === 'number' ? `${severity} . ${score.toFixed(2)}`: severity;
        return <span className={cls}> {label} </span>;
    }
}