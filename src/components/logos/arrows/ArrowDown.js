import {React, Component} from 'react';

export default class ArrowDown extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<svg width="10" height="11" viewBox="0 0 10 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
					<g id="Canvas" transform="translate(-442 -406)">
						<g id="Arrow">
							<use xlinkHref="#path0_stroke" transform="matrix(0.678826 0.734299 -0.678826 0.734299 442.641 406.882)" fill="#333333"/>
						</g>
					</g>
					<defs>
						<path id="path0_stroke" d="M 12.6538 0.353553C 12.8491 0.158291 12.8491 -0.158291 12.6538 -0.353553L 9.47183 -3.53553C 9.27657 -3.7308 8.95998 -3.7308 8.76472 -3.53553C 8.56946 -3.34027 8.56946 -3.02369 8.76472 -2.82843L 11.5931 0L 8.76472 2.82843C 8.56946 3.02369 8.56946 3.34027 8.76472 3.53553C 8.95998 3.7308 9.27657 3.7308 9.47183 3.53553L 12.6538 0.353553ZM 0 0.5L 12.3003 0.5L 12.3003 -0.5L 0 -0.5L 0 0.5Z"/>
					</defs>
				</svg>
			</div>
		);
	}
}