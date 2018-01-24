import React from 'react';

class External extends React.Component {
	constructor(props){
		super(props);
		if(!this.props.smoking) {
			this.props.updateSmoking([false,false,false])
			this.state = {
				pastSmoke: false,
				presentSmoke: false,
				futureSmoke: false
			}
		}
		else {
			this.state = {
				pastSmoke: this.props.smoking[0],
				presentSmoke: this.props.smoking[1],
				futureSmoke: this.props.smoking[2]
			}
		}
	}

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.checked
		})
		if(e.target.name === "pastSmoke") {
			this.props.updateSmoking([e.target.checked, this.state.presentSmoke, this.state.futureSmoke])
		}
		if(e.target.name === "presentSmoke") {
			this.props.updateSmoking([this.state.pastSmoke, e.target.checked, this.state.futureSmoke])
		}
		if(e.target.name === "futureSmoke") {
			this.props.updateSmoking([this.state.pastSmoke, this.state.presentSmoke, e.target.checked])
		}
	}

	render() {
		return (
			<div>
			  <br/>
			  <header className="pure-g flex-c flex-align-sb">
          	    <div className="pure-u-15-24">
            	  <div className="flex-c flexc-v-center">
              		Do you smoke?
            	  </div>
          		</div>
          	    <div className="pure-u-3-24 smaller flex-c flex-v-center">
         		  <input type="checkBox" name="pastSmoke" value={this.state.pastSmoke} onChange={this.onChange.bind(this)} checked={this.state.pastSmoke && true}/> 
      		    </div>
      		    <div className="pure-u-3-24 smaller">
				  <input type="checkBox" name="presentSmoke" value={this.state.presentSmoke} onChange={this.onChange.bind(this)} checked={this.state.presentSmoke && true}/>
          	    </div>
                <div className="pure-u-3-24 smaller">
				  <input type="checkBox" name="futureSmoke" value={this.state.futureSmoke} onChange={this.onChange.bind(this)} checked={this.state.futureSmoke && true}/>
      		    </div>
              </header>
			</div>
		);
	}
}

export default External