import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Search from './Search';
import Results from './Results';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			spotifyAuthenticated: false,
			playlists: [],
		};
		this.authenticateSpotify = this.authenticateSpotify.bind(this);
	}

	authenticateSpotify() {
		fetch('/spotify/is-authenticated')
			.then((response) => response.json())
			.then((data) => {
				this.setState({ spotifyAuthenticated: data.status });
				if (!data.status) {
					fetch('/spotify/get-auth-url')
						.then((response) => response.json())
						.then((data) => {
							window.location.replace(data.url);
						});
				}
			});
	}

	renderHome() {
		return (
			<Container>
				<Row>
					<Col>
						<h1>Welcome to the Advanced Spotify Search</h1>
						<h3>
							Now that you are authenticated. Press the button
							below to begin.
						</h3>
						<Link to="/search">
							<Button variant="primary">Enter</Button>
						</Link>
					</Col>
				</Row>
			</Container>
		);
	}

	renderAuthenticate() {
		return (
			<Container>
				<Row>
					<Col>
						<button onClick={this.authenticateSpotify}>
							authenticate
						</button>
					</Col>
				</Row>
			</Container>
		);
	}

	render() {
		return (
			<Router>
				<Switch>
					<Route path="/search" component={Search} />
					<Route path="/results" component={Results} />
					<Route
						exact
						path="/"
						render={() => {
							return this.state.spotifyAuthenticated
								? this.renderHome()
								: this.renderAuthenticate();
						}}
					/>
				</Switch>
			</Router>
		);
	}
}
