import React from 'react';
import ReactDOM from 'react-dom';
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

class TripList extends React.Component {
    // TODO: need a timer to periodically refresh data from the service.
    // TODO: make bullet descriptions more useful

    constructor() {
        super();

        this.state = {trips: []}
    }

    componentDidMount() {
        if (!(this.state.trips === undefined || this.state.trips.length === 0)) {
            let dict = [];
            this.props.trips.forEach(trip => {
                this.getDepartures(trip, dict);
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props!==nextProps) {
            let arr = [];
            nextProps.trips.forEach(trip => {
                fetch("https://svc.metrotransit.org/NexTrip/" + trip.route + "/" + trip.direction + "/" + trip.stop + "?format=json")
                .then(response => response.json())
                .then(function(json) {
                    trip.departure = json[0].DepartureText;
                    arr.push(trip);
                })
                .then(() => this.setState({trips: arr}))
                .catch(err => console.log(err));
            });
        }
    }
    
    render() {
        let arr = this.state.trips;
        if (arr === undefined || arr.length === 0) {
            return (
                <p>You don't have any saved routes yet! Add a new one below.</p>
            )
        }
        else {
            return (
                <ul className="list-group py-2">
                    {arr.map(x => <li className="list-group-item">{x.route}, {x.direction}, {x.stop}, {x.departure}</li>)}
                    {/* TODO: render descriptions rather than values */}
                </ul>
            );
        }
    }
}

class NexTripForm extends React.Component {
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
        this.setState({route: route});
    }

    handleDirectionChange(direction) {
        this.setState({direction: direction});
    }

    handleStopChange(stop) {
        this.setState({stop: stop});
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
        var directionApi = (this.state.route!=null) ? "https://svc.metrotransit.org/NexTrip/Directions/" + this.state.route + "?format=json" : "";
        var stopApi = (this.state.direction!=null) ? "https://svc.metrotransit.org/NexTrip/Stops/" + this.state.route + "/" + this.state.direction + "?format=json" : "";
        
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
                <input class="pull-right" type="submit" value="Save"/>
            </form>
        );
    }
}

  
class Select extends React.Component {
    constructor() {
        super();
        this.state = { data: [] };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onChange(e.target.value);
    }

    // Fetches data from the API and saves the json array in the component state
    getData(source, name) {
        if(source==="") {this.mapData([], name);}
        fetch(source)
        .then(response => response.json())
        .then(function(json) {
            var arr = [];
            json.forEach(item => {
                arr.push(item);
            });
            this.mapData(arr, name);
        }.bind(this))
        .catch(err => console.log(err));
    }

    // Maps the raw json from the request to value:text pairs for the select item
    mapData(arr, name) {
        var data = [];
        switch(name) {
            case ("Route"): 
                arr.map(x => data.push({value: x.Route, text: x.Description})); 
                break;
            case ("Direction"): 
                arr.map(x => data.push({value: x.Value, text: x.Text}));
                break;
            case ("Stop"): 
                arr.map(x => data.push({value: x.Value, text: x.Text}));
                break;
            default: console.log("Name '" + name +"' of select component is not in 'Route', 'Direction', or 'Stop'");
        }
        this.setState({data:data});
    }

    componentDidMount() {
        this.getData(this.props.source, this.props.name);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.source!==nextProps.source) {
            console.log(this.props.name + " component received new props. New source: " + this.props.source);
            this.getData(nextProps.source, nextProps.name);
        }
    }

    render() {
        var defaultOption = (this.state.data.length>0) ? (<option value="" selected disabled hidden>Choose an option...</option>) : (<option value="" disabled hidden>Choose an option...</option>);
        return(
            <div className="form-group form-row">
                <div className="col-p-auto">
                    <label>{this.props.name}:</label> 
                </div>
                <div className="col">
                    <select className="form-control form-control-sm col" onChange={this.handleChange}>
                        {defaultOption}
                        {this.state.data.map(x => <option value={x.value}>{x.text}</option>)}
                    </select>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));