import React, { Component } from 'react';
import { render } from 'react-dom';
import Home from './Home';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="justify-content-center m-auto text-center">
				<Home />
			</div>
		);
	}
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
