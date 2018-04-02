import React from 'react';

class External extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			pastSmoke: this.props.smoking[0],
			presentSmoke: this.props.smoking[1],
			futureSmoke: this.props.smoking[2],
			heartfamhist: this.props.heartfamhist
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
		if(e.target.name === "heartfamhist") {
			this.props.updateHeartfamhist(e.target.checked)
		}
	}

	render() {
		return (
			<div>
			{(this.props.risk === "Cardiac" || this.props.risk===undefined) &&
			<div>
			   <div className="measurement">
		        <div className="measurement-info pure-g">
		            <div className="full-wh flex-c flex-v-center flex-wrap">
	            	  <div className="pure-u-15-24">
            	  		<div className="flex-c flexc-v-center">
          				  Do you smoke?
            	 		</div>
          			  </div>
          	    	<div className="pure-u-3-24 smaller flex-c flex-v-center" style={{'justifyContent': 'center'}}>
         		  	  <input type="checkBox" name="pastSmoke" value={this.state.pastSmoke} onChange={this.onChange.bind(this)} checked={this.state.pastSmoke && true}/>
  		    	    </div>
      		    	<div className="pure-u-3-24 smaller flex-c flex-v-center" style={{'justifyContent': 'center'}}>
				  	  <input type="checkBox" name="presentSmoke" value={this.state.presentSmoke} onChange={this.onChange.bind(this)} checked={this.state.presentSmoke && true}/>
          	    	</div>
                  <div className="pure-u-3-24 smaller flex-c flex-v-center" style={{'justifyContent': 'center'}}>
				    <input type="checkBox" name="futureSmoke" value={this.state.futureSmoke} onChange={this.onChange.bind(this)} checked={this.state.futureSmoke && true}/>
  		          </div>
	            </div>
              </div>
	        </div>
			<div className="measurement">
	    	  <div className="measurement-info pure-g">
		        <div className="full-wh flex-c flex-v-center flex-wrap">
		          <div className="pure-u-15-24">
            	    <div className="flex-c flexc-v-center">
              		  Do you have a family history of heart disease?
            	    </div>
          		  </div>
          	    <div className="pure-u-3-24 smaller flex-c flex-v-center" style={{'justifyContent': 'center'}}>
         		  <input type="checkBox" name="heartfamhist" value={this.state.heartfamhist} onChange={this.onChange.bind(this)} checked={this.state.heartfamhist && true}/>
      		    </div>
      		    <div className="pure-u-3-24 smaller flex-c flex-v-center" style={{'justifyContent': 'center'}}>
				  <input type="checkBox" name="heartfamhist" value={this.state.heartfamhist} onChange={this.onChange.bind(this)} checked={this.state.heartfamhist && true}/>
          	    </div>
                <div className="pure-u-3-24 smaller flex-c flex-v-center" style={{'justifyContent': 'center'}}>
				  <input type="checkBox" name="heartfamhist" value={this.state.heartfamhist} onChange={this.onChange.bind(this)} checked={this.state.heartfamhist && true}/>
      		    </div>
		      </div>
	        </div>
       	   </div>
       	  </div>}
		</div>
		);
	}
}

export default External
