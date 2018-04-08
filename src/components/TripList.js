import React from 'react';

export class TripList extends React.Component {

    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);

        this.state = {departures: {}}
    }

    componentDidMount() {
        var trips = this.props.trips;
        if (!(trips === undefined || Object.keys(trips).length === 0)) {
            var dict = {};
            Object.keys(trips).forEach(hashId => {
                fetch("https://svc.metrotransit.org/NexTrip/" + trips[hashId].route.value + "/" + trips[hashId].direction.value + "/" + trips[hashId].stop.value + "?format=json")
                .then(response => response.json())
                .then(function(json) {
                    console.log(json);
                    dict[hashId] = (json[0]===undefined) ? "No Scheduled Departures" : json[0].DepartureText;
                })
                .then(() => this.setState({departures: dict}))
                .catch(err => console.log(err));
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props!==nextProps) {
            var trips = nextProps.trips;
            if (!(trips === undefined || Object.keys(trips).length === 0)) {
                var dict = {};
                Object.keys(trips).forEach(hashId => {
                    fetch("https://svc.metrotransit.org/NexTrip/" + trips[hashId].route.value + "/" + trips[hashId].direction.value + "/" + trips[hashId].stop.value + "?format=json")
                    .then(response => response.json())
                    .then(function(json) {
                        dict[hashId] = (json[0]===undefined) ? "No Scheduled Departures" : json[0].DepartureText;
                    })
                    .then(() => this.setState({departures: dict}))
                    .catch(err => console.log(err));
                });
            }
        }
    }

    handleClick(trip) {
        this.props.onRemove(trip);
    }
    
    render() {
        let trips = this.props.trips;
        let departures = this.state.departures;
        if (trips === undefined || Object.keys(trips).length === 0) {
            return (
                <p>You don't have any saved routes yet! Add a new one below.</p>
            )
        }
        else {
            return (
                <div className="list-group list-group-flush">
                    {Object.keys(trips).map(x => 
                        <a href="#" class="list-group-item list-group-item-action flex-column align-items-start" onClick={() => {this.handleClick(x)}}>
                            <h5 class="mb-1 d-flex w-100 justify-content-between">
                                {trips[x].route.value}
                                {departures[x]==="No Scheduled Departures" && <span class="badge badge-default">{departures[x]}</span>}
                                {String(departures[x]).includes("Min") && <span class="badge badge-primary">Nextrip: {departures[x]}</span>}
                                {String(departures[x]).includes(":") && <span class="badge badge-info">Scheduled: {departures[x]}</span>}
                            </h5>
                            <small>{trips[x].direction.description} from {trips[x].stop.description}</small>
                        </a>)}
                </div>
            );
        }
    }
}


export default TripList;