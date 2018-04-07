import React from 'react';

export class TripList extends React.Component {
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
                fetch("https://svc.metrotransit.org/NexTrip/" + trip.route.value + "/" + trip.direction.value + "/" + trip.stop.value + "?format=json")
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
                    {arr.map(x => <li className="list-group-item">{x.route.description}, {x.direction.description}, {x.stop.description}, {x.departure}</li>)}
                    {/* TODO: render descriptions rather than values */}
                </ul>
            );
        }
    }
}


export default TripList;