import React from 'react';
import ReactDOM from 'react-dom';
import TripList from './components/TripList.js';
import NexTripForm from './components/NexTripForm.js'
import './index.css';

class App extends React.Component {
    // TODO: Make saved trips persistent using chrome extension storage.
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {trips: []};
    }

    handleSubmit(trip) {
        let trips = this.state.trips;
        if (!trips.includes(trip)) {
            trips.push(trip);
        }
        this.setState({trips: trips});
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