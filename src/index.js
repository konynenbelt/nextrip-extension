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
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.handlePlusClick = this.handlePlusClick.bind(this);

        this.state = {
            trips: {},
            view: ""
        };

        this.port = chrome.extension.connect({name:"index"});

        this.port.onMessage.addListener(message => {
            this.setState({
                trips: message,
                view: (Object.keys(message).length===0) ? "form" : "list"
            }, () => console.log(this.state.view));
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

    handleRefreshClick() {
        this.forceUpdate();
    }

    handlePlusClick() {
        this.setState({view: "form"});
    }

    render() {
        return (
            <div>
                <h1 className="p-2 d-flex w-100 justify-content-between">
                    Nextrip Feed 
                    <span>   
                        <button type="button" className="btn btn-primary px-1" onClick={this.handlePlusClick}>
                            <span className="fa fa-plus"></span>
                        </button>
                        <button type="button" className="btn btn-default px-1" onClick={this.handleRefreshClick}>
                            <span className="fa fa-refresh"></span>
                        </button>
                    </span>
                </h1>
                {this.state.view==="list" && <TripList trips={this.state.trips} onRemove={this.handleRemove}/>}
                {this.state.view==="form" && <NexTripForm onSubmit={this.handleSubmit}/>}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));