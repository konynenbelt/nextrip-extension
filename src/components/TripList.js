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
                    dict[hashId] = json[0].DepartureText;
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
                        dict[hashId] = json[0].DepartureText;
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
                <ul className="list-group py-2">
                    {Object.keys(trips).map(x => <li className="list-group-item" onClick={() => {this.handleClick(x)}}>{trips[x].route.description}, {trips[x].direction.description}, {trips[x].stop.description}, {departures[x]}</li>)}
                </ul>
            );
        }
    }
}


export default TripList;