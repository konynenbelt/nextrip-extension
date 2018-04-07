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

        this.state = {trips: {}};

        this.port = chrome.extension.connect({name:"index"});

        this.port.onMessage.addListener(message => {
            this.setState({trips: message});
        });
    }

    handleSubmit(hashId, trip) {
        let trips = this.state.trips;

        if (!(hashId in trips)) {
            trips[hashId] = trip;
        }

        this.setState({trips: trips});
        this.port.postMessage(trips);
    }

    handleRemove(hashId) {
        let trips = this.state.trips;

        delete trips[hashId];

        this.setState({trips: trips});
        this.port.postMessage(trips);
    }
    
    render() {
        return (
            <div className="px-2">
                <h1>Nextrip Feed</h1>
                <TripList trips={this.state.trips} onRemove={this.handleRemove}/>
                <NexTripForm onSubmit={this.handleSubmit}/>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));