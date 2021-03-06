import React from 'react';

export class Select extends React.Component {
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

    // Maps the raw json from the request to value:description pairs for the select item
    mapData(arr, name) {
        var data = [];
        switch(name) {
            case ("Route"): 
                arr.map(x => data.push({value: x.Route, description: x.Description})); 
                break;
            case ("Direction"): 
                arr.map(x => data.push({value: x.Value, description: x.Text}));
                break;
            case ("Stop"): 
                arr.map(x => data.push({value: x.Value, description: x.Text}));
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
                    <select className="form-control form-control-sm col" onChange={this.handleChange} required>
                        {defaultOption}
                        {this.state.data.map(x => <option value={JSON.stringify({value: x.value, description: x.description})}>{x.description}</option>)}
                    </select>
                </div>
            </div>
        );
    }
}

export default Select;