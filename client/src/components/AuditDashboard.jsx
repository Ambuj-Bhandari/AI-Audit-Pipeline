import React from "react";
import EntryTable from "./EntryTable.jsx";
import DiagnosticModel from "./DiagnosticModel.jsx";

const POLL_MS = 3000;
export default class AuditDashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            entries:[],
            selectedId: null,
            loading:true,
            error: null
        };
        this.select = this.select.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount(){
        this.refresh();
        this.poll = setInterval(this.refresh, POLL_MS);
    }
    componentWillUnmount(){
        clearInterval(this.poll);
    }

    async refresh(){
        try{
            const { entries } = await this.props.api.listEntries();
            this.setState({entries, loading:false, error:null});
        }catch(err){
            this.setState({error: err.message, loading:false});
        }
    }

    select(entry){
        this.setState({selectedId: entry._id});
    }
    closeModal(){
        this.setState({selectedId:null});
    }

    stats(){
        const { entries } = this.state;
        const total = entries.length;
        const high = entries.filter((e)=> e.intelligence?.severity === 'high').length;
        const anomalies = entries.reduce((n, e)=> n + (e.intelligence?.anomalies?.length || 0),0);
        const failing = entries.filter((e) => e.intelligence?.compliance?.ifrsPass === false).length;
        return {total, high, anomalies, failing};
    }

    render(){
        const { entries, selectedId, loading, error } = this.state;
        const selected = entries.find((e)=> e._id === selectedId) || null;
        const {total, high, anomalies, failing} = this.stats();

        return(
            <div>
                <div className="command-bar py-3 mb-4">
                    <div className="conatiner d-flex justify-content-between align-items-center">
                        <div>
                            <div className="brand"> <span className="brand-mark"></span>Ledger Sentinel </div>
                            <div className="tagline">AI-Enriched Financial Audit Pipeline</div>
                        </div>
                        <button className="btn btn-sm btn-outline-light" onClick={this.refresh}>Refresh</button>
                    </div>
                </div>
                <div className="container">
                    {error && <div className="alert alert-danger"> Cannor Reach API: {error}</div>}

                    <div className="row g-3 mb-4">
                        <div className="col-6 col-md-3">
                            <div className="card stat-card p-3"> <div className="stat-value">{total}</div> <div className="stat-label">Enttries</div></div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card stat-card p-3"> <div className="stat-value risk-high">{high}</div> <div className="stat-label">High Risk</div></div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card stat-card p-3"> <div className="stat-value">{anomalies}</div> <div className="stat-label">Anomaly Signals</div></div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card stat-card p-3"> <div className="stat-value risk-medium">{failing}</div> <div className="stat-label">IFRS Failing</div></div>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card header bg-white d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">Journal Entries</span>
                            <span className="text-muted small"> Click a row for deep diagnostics</span>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="p-4 text-center text-muted">
                                    Loading Ledger
                                </div>
                            ) : (
                                <EntryTable entries={entries} onSelect={this.select}/>
                            )}
                        </div>

                    </div>
                </div>

                {selected && (
                    <DiagnosticModel api={this.props.api} entry={selected} onClose={this.closeModal}/>
                )}
            </div>
        );
    }
}