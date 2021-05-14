import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Results from './Results';

export default class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playlists: [],
		};
		this.getPlaylists = this.getPlaylists.bind(this);
		// this.renderPlaylists = this.renderPlaylists.bind(this);
		this.getResults = this.getResults.bind(this);
		this.getPlaylists();
	}

	getResults(e) {
		e.preventDefault();
		const playlists = this.state.playlists;
		this.props.history.push({
			pathname: '/results',
			search: `?song=${this.search.value}`,
			playlists: playlists,
		});
	}

	// getPlaylists() {
	// 	fetch('/spotify/get-playlists')
	// 		.then((response) => {
	// 			if (!response.ok) {
	// 				return {};
	// 			} else {
	// 				return response.json();
	// 			}
	// 		})
	// 		.then((data) => {
	// 			this.setState({ playlists: data.items });
	// 		});
	// }

	getPlaylists() {
		this.setState({
			form: false,
		});
		fetch('/spotify/get-songs-from-playlists')
			.then((response) => {
				if (!response.ok) {
					return {};
				} else {
					return response.json();
				}
			})
			.then((data) => {
				this.setState({ playlists: data });
			});
		// console.log(this.state.songs);
	}

	// renderPlaylists() {
	// 	const listItems = this.state.playlists.map((d) => (
	// 		<li key={d.name}>
	// 			{d.name}
	// 			{d.id}
	// 		</li>
	// 	));

	// 	return <div>{listItems}</div>;
	// }

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<Form onSubmit={this.getResults}>
							<Form.Label htmlFor="searchBar">
								Enter a song:
							</Form.Label>
							<Form.Control
								id="searchBar"
								type="text"
								size="large"
								placeholder="Search..."
								ref={(input) => {
									this.search = input;
								}}
							/>
							<Button type="submit">Search</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		);
	}
}
