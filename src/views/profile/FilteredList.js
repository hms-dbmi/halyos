import React, { Component } from 'react';
import VitalTile from './VitalTile';
import 'purecss/build/pure.css';

export class FilteredList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        initialItems: this.props.measurements,
        items: []
    }
  }
  filterList(event) {
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item){
      return item["name"].toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    console.log(updatedList);
    this.setState({items: updatedList});
  }

    componentWillMount(){
      this.setState({items: this.state.initialItems})
    }

    render(){
      return (
        <div>
          <div className="pure-g">
            <div className="pure-u-12-24">
              <text> Measurements: </text><input type="text" placeholder="Search" onChange={(e) => this.filterList(e)}/>
            </div>
            <div className="pure-u-4-24" >
              <text> Past </text>
            </div>
            <div className="pure-u-4-24" >
              <text> Present </text>
            </div>
            <div className="pure-u-4-24" >
              <text> Future </text>
            </div>
          </div>
          <br/>
          <List items={this.state.items}/>
        </div>
      );
    }
  }
  

export var List = React.createClass({
  render: function(){
    return (
      <div className="pure-u-24-24" style={{"padding-left":"2px", "padding-right":"2px", "height":"300px", "overflow":"auto"}}>
      {
        this.props.items.map(function(item) {
          return <VitalTile measurementName={item["name"]}
                  units={item["units"]}
                  past={item["past"]}
                  present={item["present"]}
                  future={item["future"]}
                  />
        })
       }
      </div>
    )  
  }
});