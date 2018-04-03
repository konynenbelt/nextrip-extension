import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {departures: []};
    }

    handleSubmit(state) {
        let departures = this.state.departures;
        if (!departures.includes(state)) {
            departures.push(state);
        }
        this.setState({departures: departures}, () => console.log(this.state));
    }
    
    render() {
        return (
            <div>
            <h1>Add a Stop!</h1>
            <DepartureList departures={this.state.departures}/>
            <NexTripForm onSubmit={this.handleSubmit}/>
            </div>
        );
    }
}

class DepartureList extends React.Component {
    render() {
        return (
            <p>DEPARTURES LIST WILL GO HERE</p>
        );
    }
}

class NexTripForm extends React.Component {
    constructor() {
        super();
        
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.handleDirectionChange = this.handleDirectionChange.bind(this);
        this.handleStopChange = this.handleStopChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
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
    }
    
    render() {
        var routeApi = "https://svc.metrotransit.org/NexTrip/Routes?format=json";
        var directionApi = "https://svc.metrotransit.org/NexTrip/Directions/" + this.state.route + "?format=json";
        var stopApi = "https://svc.metrotransit.org/NexTrip/Stops/" + this.state.route + "/" + this.state.direction + "?format=json";
        
        return (
            <form onSubmit={this.handleSubmit}>
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
                <input type="submit" value="Submit"/>
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

    // Fetches data from the API and saves the json array in the object state
    getData(source, name) {
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
        return(
            <fieldset>
                <label>
                    {this.props.name}:
                    <select onChange={this.handleChange}>
                        {this.state.data.map(x => <option value={x.value}>{x.text}</option>)}
                    </select>
                </label>
            </fieldset>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));