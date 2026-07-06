import React from "react";
import RiskBadge from "./RiskBadge.jsx";

export default class EntryTable extends React.Component{
    rowClass(entry){
        const sev = entry.intelligence?.severity;
        if( sev == 'high') return 'entry-row row-risk-high';
        if( sev == 'medium') return 'entry-row row-risk-medium';
        return 'entry-row';
    }

    render(){
        const { entries, onSelect } = this.props;
        return(
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Entry No</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th className="text-end">Amount</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                            <th>Risk</th>
                            <th>Anomalies</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((e)=> (
                            <tr key={e._id} className={this.rowClass(e)} onClick={()=>onSelect(e)}>
                                <td className="mono">{e.entryNo}</td>
                                <td> {e.name} </td>
                                <td className="text-truncate" style={{maxWidth: 220}}> {e.description} </td>
                                <td className="text-end mono"> {e.amount.toLocaleString()} </td>
                                <td className="text-end mono"> {e.debit.toLocaleString()} </td>
                                <td className="text-end mono"> {e.credit.toLocaleString()} </td>
                                <td> <RiskBadge severity={e.intelligence?.severity} score={e.intelligence?.riskScore} /> </td>
                                <td className="text-center"> {e.intelligence?.anomalies?.length ?? 0} </td>
                                <td> <span className="text-muted small"> {e.intelligence?.status} </span> </td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center text-muted py-4">
                                    No Entries yet. Run <code>npm run seed</code> to ingest ledger data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}