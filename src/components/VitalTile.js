import React, { Component } from 'react';
import {ArrowDown} from './logos/arrows/Arrow-Down.js';
import {ArrowSame} from './logos/arrows/Arrow-Same.js';
import {ArrowUp} from './logos/arrows/Arrow-Up.js';
import PastGraph from './Graphs/PastGraph.js';

import './VitalTile.css';


class VitalTile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			measurementName: this.props.measurementName
		}
	}

	componentDidMount() {
		var acc = document.getElementsByClassName("accordion");
		var i;

		for (i = 0; i < acc.length; i++) {
		    acc[i].onclick = function(){
		        this.classList.toggle("active");
			    var panel = this.nextElementSibling;
			    if (panel.style.maxHeight){
			      panel.style.maxHeight = null;
			    } else {
			      panel.style.maxHeight = panel.scrollHeight + "px";
			    } 
		    }
		}
	}

	render() {

		var arrow = <ArrowSame/>;
		if(this.props.past < this.props.present) {
			arrow = <ArrowUp/>;
		}
		else if(this.props.past > this.props.present) {
			arrow = <ArrowDown/>;
		}
		return (
			<div>
				<div className="accordion">
					<div className="pure-u-12-24">
						{this.props.measurementName} &nbsp; [{this.props.units}]
					</div>
					<div className="pure-u-2-24">
						{this.props.past}
					</div>
					<div className="pure-u-2-24">
						{arrow} 
					</div>
					<div className="pure-u-4-24">
						{this.props.present}
					</div>
					<div className="pure-u-4-24">
						{this.props.future}
					</div>
					<hr/>
				</div>
				<div className="panel">
					<PastGraph/>	
				</div>
			</div>
		)
	}
}

export default VitalTile;