import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class AIQ extends Component {
	render() {
		return (

			<OverlayTrigger placement={this.props.placement} overlay={this.props.tooltip}>
				<svg width="70%" height="70%" viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'>
				    <defs>
				        <linearGradient x1='24.38%' y1='104.275%' x2='63.682%' y2='26.23%' id='linearGradient-1'>
				            <stop stopColor='#CECECE' offset='0%' />
				            <stop stopColor='#ABABAB' offset='100%' />
				        </linearGradient>
				        <linearGradient x1='-23019.176%' y1='3474%' x2='-24274.523%' y2='2631%'
				        id='linearGradient-2'>
				            <stop stopColor='#CECECE' offset='0%' />
				            <stop stopColor='#ABABAB' offset='100%' />
				        </linearGradient>
				        <linearGradient x1='27.332%' y1='35.106%' x2='91.53%' y2='77.332%' id='linearGradient-3'>
				            <stop stopColor='#BABABA' offset='2%' />
				            <stop stopColor='#828282' stopOpacity='0' offset='100%' />
				        </linearGradient>
				        <linearGradient x1='72.668%' y1='64.894%' x2='8.47%' y2='22.668%' id='linearGradient-4'>
				            <stop stopColor='#9C9C9C' offset='2%' />
				            <stop stopColor='#A1A1A1' stopOpacity='0' offset='99%' />
				        </linearGradient>
				    </defs>
				    <g id='Page-1' fill='none' fillRule='evenodd'>
				        <g id='Group' transform='translate(3 9)' fillRule='nonzero'>
				            <g id='weather_46'>
				                <path d='M23.26,4.73316543e-30 C29.0228377,0.00190933312 34.3114176,3.19276283 37,8.29 C41.4438394,5.69257004 47.0388467,6.1582271 50.9921669,9.45452954 C54.9454872,12.750832 56.4094228,18.1709644 54.6532223,23.009364 C52.8970219,27.8477636 48.2972617,31.0669481 43.15,31.06 L23.26,31.11 C14.6692107,31.11 7.705,24.1457893 7.705,15.555 C7.705,6.96421072 14.6692107,-8.8817842e-15 23.26,-1.0658141e-14 L23.26,4.73316543e-30 Z'
				                id='Shape' fill='url(#linearGradient-1)' />
				                <path d='M35.38,45.79 C29.6135709,45.7918002 24.3202579,42.6004137 21.63,37.5 C17.1861606,40.09743 11.5911533,39.6317729 7.63783308,36.3354705 C3.68451282,33.039168 2.22057719,27.6190356 3.97677766,22.780636 C5.73297813,17.9422364 10.3327383,14.7230519 15.48,14.73 L35.37,14.68 C43.9607893,14.68 50.925,21.6442107 50.925,30.235 C50.925,38.8257893 43.9607893,45.79 35.37,45.79 L35.38,45.79 Z'
				                id='Shape' fill='url(#linearGradient-2)' />
				                <circle id='Oval' fill='url(#linearGradient-3)' transform='rotate(-74.39 15.492 26.957)'
				                cx='15.492' cy='26.957' r='12.22' />
				                <circle id='Oval' fill='url(#linearGradient-4)' transform='rotate(-74.39 43.155 18.84)'
				                cx='43.155' cy='18.84' r='12.22' />
				            </g>
				        </g>
				        <text id='AQI' fontFamily='TrebuchetMS-Bold, Trebuchet MS' fontSize='17'
				        fontWeight='bold' fill='#FFF'>
				            <tspan x='17.225' y='38'>AQI</tspan>
				        </text>
				    </g>
				</svg>
			</OverlayTrigger>

		);
	}
}

export default AIQ;