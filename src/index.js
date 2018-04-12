import React from 'react';
import ReactDOM from 'react-dom';
import TripList from './components/TripList.js';
import NexTripForm from './components/NexTripForm.js';

class App extends React.Component {
    port;

    // STATE SCHEMA: 
    // {
    //     trips: {
    //         1234: {trip object 1},
    //         5432: {trip object 2}
    //     }
    // }
    
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleAdd = this.handleAdd.bind(this);

        this.state = {
            trips: {},
            view: "",
            loading: true
        };

        this.port = chrome.extension.connect({name:"index"});

        this.port.onMessage.addListener(message => {
            this.setState({
                trips: (message==undefined || Object.keys(message).length===0) ? {} : message,
                view: (message==undefined || Object.keys(message).length===0) ? "form" : "list",
                loading: false
            });
        });
    }

    handleSubmit(hashId, trip) {
        let trips = this.state.trips;

        if (!(hashId in trips)) {
            trips[hashId] = trip;
        }

        this.setState({
            trips: trips,
            view: (Object.keys(trips).length===0) ? "form" : "list"
        });
        this.port.postMessage(trips);
    }

    handleRemove(hashId) {
        let trips = this.state.trips;

        delete trips[hashId];

        this.setState({
            trips: trips,
            view: (Object.keys(trips).length===0) ? "form" : "list"
        });
        this.port.postMessage(trips);
    }

    handleRefresh() {
        this.setState({ loading: true });
        this.forceUpdate(this.setState({ loading: false }));
    }

    handleAdd() {
        this.setState({view: "form"});
    }

    handleCancel() {
        this.setState({view: "list"});
    }

    render() {
        return (
            <div>
                {this.state.loading && <p>Fetching latest trip information...</p> }
                <h1 className="p-2 d-flex w-100 justify-content-between">
                    Bus Feed
                    <div className="btn-toolbar" role="toolbar">
                        <div className="btn-group ml-2">
                            <button type="button" className="btn btn-primary" onClick={this.handleAdd}>
                                <span className="fa fa-plus"></span>
                            </button>
                        </div>
                        <div className="btn-group ml-2">
                            <button type="button" className="btn btn-secondary" onClick={this.handleRefresh}>
                                <span className="fa fa-refresh"></span>
                            </button>
                        </div>
                    </div>
                </h1>
                {this.state.view==="list" && <TripList trips={this.state.trips} onRemove={this.handleRemove}/>}
                {this.state.view==="form" && <NexTripForm onSubmit={this.handleSubmit} onCancel={this.handleCancel}/>}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));