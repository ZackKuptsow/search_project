import React, { Component } from 'react';
import { render } from 'react-dom';
// import HomePage from './HomePage';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			// <div className="justify-content-center m-auto">
			// 	<HomePage />
			// </div>
			<div className="justify-content-center m-auto text-center">
				<h1>Test</h1>
			</div>
		);
	}
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
