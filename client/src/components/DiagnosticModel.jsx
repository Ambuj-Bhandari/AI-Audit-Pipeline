import React from "react";
import RiskBadge from "./RiskBadge.jsx";

const STRATEGIES = ['semantic', 'financial', 'entity'];

export default class DiagnosticModel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            strategy: 'semantic',
            results: [],
            searching: false,
            searchError: null
        };
        this.runSearch = this.runSearch.bind(this);
    }

    componentDidUpdate(prevProps){
        if(prevProps.entry?._id !== this.props.entry?._id){
            this.setState({ results:[], searchError: null, strategy: 'semantic' });
        }
    }

    async runSearch(strategy){
        const { api, entry } = this.props;
        this.setState({ strategy, searching: true, searchError: null, results:[] });
        try{
            const { results } = await api.searchSimilar(entry._id, strategy);
            this.setState({ results, searching:false});
        }
        catch(err){
            this.setState({ searchError: err.message, searching:false});
        }
    }

    renderVectorStrip(vector=[]){
        return (
            <div className="vector-strip">
                {vector.map((v,i)=>(
                    <div key={i} className="vector-cell" title={v.toFixed(4)} style={{background: `hsl(190, 60%, ${25+v*55}%)`}}>
                        {v.toFixed(1)}
                    </div>
                ))}
                {vector.length === 0 && <span className="text-muted small"> no vector</span>}
            </div>
        );
    }

    render(){
        const { entry, onClose } = this.props;
        if(!entry) return null;
        const intel = entry.intelligence || {};
        const { strategy, results, searching, searchError } = this.state;

        return (
            <div className="modal show d-block" tabIndex="-1" role="dialog" style={{background: 'rgba(13,27,42,0.55'}}>
                <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div>
                                <h5 className="modal-title mono mb-0"> {entry.entryNo} </h5>
                                <small className="text-muted"> {entry.name} . GL {entry.glNumber} </small>
                            </div>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
                        </div>

                        <div className="modal-body">
                            {/* Summary */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <div className="text-muted small">
                                        Amount
                                    </div>
                                    <div className="fs-5 mono">{entry.amount.toLocaleString()} {entry.currency}</div>
                                </div>
                                <div className="text-end">
                                    <div className="text-muted small"> Risk </div>
                                    <RiskBadge severity={intel.severity} score={intel.riskScore}/>
                                </div>
                            </div>
                            <p className="mb-3"> <span className="text-muted">Description: </span> {entry.description} </p>
                            {/* Anomalies */}
                            <h6 className="text-uppercase text-muted small"> Anomaly Signals</h6>
                            {intel.anomalies?.length ? (
                                <ul className="list-group mb-3">
                                    {intel.anomalies.map((a,i)=> (
                                        <li key={i} className="list-group-item d-flex justify-content-between">
                                            <span>
                                                <span className={`fw-semibold risk-${a.severity}`}> {a.type} </span>
                                                <span className="text-muted"> on </span>
                                                <code>{a.field}</code>
                                                <div className="small text-muted">{a.details}</div>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ):(
                                <p className="text-muted small"> No Anomalies Detetcted </p>
                            )}

                            {/* Compliance */}
                            <h6 className="text-uppercase text-muted small">IFRS Complaince</h6>
                            <p className="mb-3">
                                {intel.compliance?.ifrsPass ? (
                                    <span className="badge bg-success"> PASS </span>
                                ): (
                                    <span className="badge bg-danger"> FAIL </span>
                                )}{' '}
                                {intel.compliance?.flags?.map((f) => (
                                    <span key={f} className="badge bg-light text-dark border me-1 mono"> {f} </span>
                                ))}
                            </p>

                            {/* Multi-Vector Diagnostic */}
                            <h6 className="text-uppercase text-muted small"> Multi-space vectors <span className="text-muted">(modek {intel.modelVersion}</span></h6>
                            <div className="mb-1"> <small className="text-muted">Semantic</small> {this.renderVectorStrip(intel.vectors?.semantic)} </div>
                            <div className="mb-1"> <small className="text-muted">Financial</small> {this.renderVectorStrip(intel.vectors?.financial)} </div>
                            <div className="mb-3"> <small className="text-muted">Entity</small> {this.renderVectorStrip(intel.vectors?.entity)} </div>

                            {/* Similarity Search */}
                            <h6 className="text-uppercase text-muted small"> Similarity Search - top 5</h6>
                            <div className="btn-group strategy-toggle mb-3" role="group">
                                {STRATEGIES.map((s)=> (
                                    <button key={s} type="button" className={`btn btn-sm ${strategy===s ? 'btn-dark': 'btn-outline-dark'}`} onClick={()=> this.runSearch(s)} disabled={searching}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {searching && <div className="text-muted small"> Searching {strategy} space...</div>}
                            {searchError && <div className="alert alert-warning py-2"> {searchError }</div>}
                            {!searching && results.length > 0 && (
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Entry</th>
                                            <th>Name</th>
                                            <th className="text-end">Amount</th>
                                            <th>Risk</th>
                                            <th className="text-end">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((r)=> (
                                            <tr key={r.entryId}>
                                                <td className="mono">{r.entryNo}</td>
                                                <td>{r.name}</td>
                                                <td className="text-end mono">{r.amount.toLocaleString()}</td>
                                                <td><RiskBadge severity={r.severity} /></td>
                                                <td className="text-end mono"> { r.score.toFixed(4)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" onClick={onClose}> Close </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}