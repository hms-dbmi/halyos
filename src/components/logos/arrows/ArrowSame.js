import React, {Component} from 'react';

export class ArrowSame extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<svg width="14" height="8" viewBox="0 0 14 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
					<g id="Canvas" transform="translate(-440 -582)">
						<g id="Arrow">
							<use xlinkHref="#path0_stroke" transform="matrix(1 6.00475e-17 -5.13175e-17 1 440.912 585.966)" fill="#333333"/>
						</g>
					</g>
					<defs>
						<path id="path0_stroke" d="M 12.1619 0.353553C 12.3571 0.158291 12.3571 -0.158291 12.1619 -0.353553L 8.97988 -3.53553C 8.78462 -3.7308 8.46803 -3.7308 8.27277 -3.53553C 8.07751 -3.34027 8.07751 -3.02369 8.27277 -2.82843L 11.1012 0L 8.27277 2.82843C 8.07751 3.02369 8.07751 3.34027 8.27277 3.53553C 8.46803 3.7308 8.78462 3.7308 8.97988 3.53553L 12.1619 0.353553ZM 0 0.5L 11.8083 0.5L 11.8083 -0.5L 0 -0.5L 0 0.5Z"/>
					</defs>
				</svg>
			</div>
		);
	}
}