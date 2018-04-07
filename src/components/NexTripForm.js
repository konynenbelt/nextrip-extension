import React from 'react';
import Select from './Select.js';

export class NexTripForm extends React.Component {
    constructor() {
        super();
        
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.handleDirectionChange = this.handleDirectionChange.bind(this);
        this.handleStopChange = this.handleStopChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        // TODO: update state representation to include value/description pairs for each route, direction, and stop.
        // Value for API, description for UI.
        this.state = {
            route: null,
            direction: null,
            stop: null
        }
    }

    handleRouteChange(route) {
        this.setState({route: JSON.parse(route)});
    }

    handleDirectionChange(direction) {
        this.setState({direction: JSON.parse(direction)});
    }

    handleStopChange(stop) {
        this.setState({stop: JSON.parse(stop)});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
        this.setState({
            route: null,
            direction: null,
            stop: null
        });
    }
    
    render() {
        var routeApi = "https://svc.metrotransit.org/NexTrip/Routes?format=json";
        var directionApi = (this.state.route!=null) ? "https://svc.metrotransit.org/NexTrip/Directions/" + this.state.route.value + "?format=json" : "";
        var stopApi = (this.state.direction!=null) ? "https://svc.metrotransit.org/NexTrip/Stops/" + this.state.route.value + "/" + this.state.direction.value + "?format=json" : "";
        
        // TODO: disable submit until form is filled out and state is updated
        return (
            <form className="p-2" onSubmit={this.handleSubmit}>
                <h5>Add a new route: </h5>
                <Select 
                    name="Route"
                    source={routeApi}
                    onChange={this.handleRouteChange}/>
                <Select 
                    name="Direction"
                    source={directionApi}
                    onChange={this.handleDirectionChange}/>
                <Select 
                    name="Stop"
                    source={stopApi}
                    onChange={this.handleStopChange}/>
                <input class="py-2" type="submit" value="Save"/>
            </form>
        );
    }
}


export default NexTripForm;