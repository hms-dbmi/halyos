class OldAppointmentsTile extends Component {
	constructor(props) {
		super();
	}

	componentDidMount() {

	}

	render() {
		return (
			<iframe src="https://calendar.google.com/calendar/embed?title=Appointments&amp;showTitle=0&amp;showTabs=0&amp;showCalendars=0&amp;mode=AGENDA&amp;height=132&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=samson.mataraso%40berkeley.edu&amp;color=%23182C57&amp;ctz=America%2FLos_Angeles" style={{borderWidth:0}} width="610" height="132" frameborder="0" scrolling="no"></iframe>
		);
	}
}

export default OldAppointmentsTile;