import React from 'react';
import ReactDOM from 'react-dom';
import TripList from './components/TripList.js';
import NexTripForm from './components/NexTripForm.js';

class App extends React.Component {
    port;
    
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {trips: []};

        this.port = chrome.extension.connect({name:"index"});

        this.port.onMessage.addListener(message => {
            this.setState({trips: message});
        });
    }

    handleSubmit(trip) {
        let trips = this.state.trips;
        if (!trips.includes(trip)) {
            trips.push(trip);
        }
        this.setState({trips: trips}, () => console.log(this.state.trips));
        this.port.postMessage(trips);
    }
    
    render() {
        return (
            <div className="px-2">
                <h1>Nextrip Feed</h1>
                <TripList trips={this.state.trips}/>
                <NexTripForm onSubmit={this.handleSubmit}/>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));