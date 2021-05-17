import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Jumbotron } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

export default class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: true,
			song: '',
			// playlists: [],
			results: [],
		};
		this.getResults = this.getResults.bind(this);
		this.getPlaylists = this.getPlaylists.bind(this);
		// this.renderPlaylists = this.renderPlaylists.bind(this);
		this.renderPlaylistResults = this.renderPlaylistResults.bind(this);
		this.renderSearch = this.renderSearch.bind(this);
		this.renderResults = this.renderResults.bind(this);
		this.generateCards = this.generateCards.bind(this);
	}

	getResults(e) {
		e.preventDefault();
		this.setState(
			{
				song: this.searchBar.value,
			},
			() => {
				fetch(
					`/spotify/get-songs-from-playlists?song=${this.state.song}`
				)
					.then((response) => {
						if (!response.ok) {
							return {};
						} else {
							return response.json();
						}
					})
					.then((data) => {
						this.setState(
							{
								results: data,
							},
							() => {
								this.setState({
									search: false,
								});
							}
						);
					});
			}
		);

		// const playlists = this.state.playlists;
		// this.props.history.push({
		// 	pathname: '/results',
		// 	search: `?song=${this.search.value}`,
		// 	playlists: playlists,
		// });
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

	renderPlaylistResults() {
		const listOfPlaylists = Object.keys(this.state.results).map(
			(playlist_id) => {
				const playlist = this.state.results[playlist_id];
				return (
					<li>
						Playlist: {playlist.playlist_name}
						Song: {playlist.song_name}
						Match Percentage:{' '}
						{Math.round(playlist.match * 100) / 100}%
					</li>
				);
			}
		);
		return <div>{listOfPlaylists}</div>;
	}

	renderSearch() {
		return (
			<Container>
				<Row>
					<Col>
						<Form
							className="d-inline-block"
							onSubmit={this.getResults}
						>
							<Form.Label as="h1" htmlFor="searchBar">
								Enter a song:
							</Form.Label>
							<Form.Control
								id="searchBar"
								className="my-auto"
								type="text"
								size="large"
								placeholder="Search..."
								ref={(input) => {
									this.searchBar = input;
								}}
							/>
							<Button className="mt-3" type="submit">
								Search
							</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		);
	}

	renderResults() {
		const getMaxMatch = () => {
			let matches = [];
			for (let playlist in this.state.results) {
				matches.push(this.state.results[playlist].match);
			}
			return Math.max(...matches);
		};
		return (
			<Container>
				<Jumbotron id="searchResults" className="p-3">
					<Container>
						<Row>
							<Col>
								<h1>Song Search:</h1>
								<h1>"{this.state.song}"</h1>
							</Col>
							<Col>
								<h1>
									Results:{' '}
									{Object.keys(this.state.results).length}
								</h1>
								<h1>Highest Match: {getMaxMatch()}%</h1>
							</Col>
						</Row>
					</Container>
				</Jumbotron>
				<Container className="m-auto mt-5 pt-5">
					<Row className="my-3">{this.generateCards('top')}</Row>
					<Row className="my-3">
						{Object.keys(this.state.results).length > 5
							? this.generateCards('bottom')
							: null}
					</Row>
				</Container>
			</Container>
		);
	}

	generateCards(row) {
		const makeCard = (key) => {
			return (
				<Col>
					<Card className="text-center p-0">
						<Card.Header as="h5" className="p-3">
							<a
								href={`http://open.spotify.com/user/spotify/playlist/${key}`}
							>
								{this.state.results[key]['playlist_name']}
							</a>
						</Card.Header>
						<Card.Body className="m-auto py-auto">
							<Card.Subtitle>
								{this.state.results[key]['song_name']}
							</Card.Subtitle>
							<Card.Text>
								Match Percentage:{' '}
								{this.state.results[key]['match']}%
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			);
		};
		let cards = [];
		const resultsLen = Object.keys(this.state.results).length;
		if (row === 'top') {
			const keys =
				resultsLen > 5
					? Object.keys(this.state.results).slice(
							0,
							Math.ceil(resultsLen / 2)
					  )
					: Object.keys(this.state.results);
			for (let key of keys) {
				cards.push(makeCard(key));
			}
			return cards;
		} else {
			const keys = Object.keys(this.state.results).slice(
				Math.ceil(resultsLen / 2)
			);
			for (let key of keys) {
				cards.push(makeCard(key));
			}
			return cards;
		}
	}

	render() {
		return this.state.search ? this.renderSearch() : this.renderResults();
	}
}
