import React from 'react';

class External extends React.Component {
	constructor(props){
		super(props);
	}
	render() {
		return (
			<div> 
				<input type="checkBox" id="smoker" value="smoking"/> <label for="smoker">Do you smoke?</label><br/>
				<input type="checkBox" id="cardiac" value="cardiacfamhist"/> <label for="cardiac">Do you have a family history of heart disease?</label><br/>
				<input type="checkBox" id="diabetes" value="diabetesfamhist"/> <label for="diabetes">Do you have a family history of diabetes?</label><br/>
				<input type="checkBox" id="exercise" value="active"/> <label for="exercise">Do you exercise for more than 30 minutes, at least twice a week?</label><br/>
			</div>
		);
	}
}

export default External