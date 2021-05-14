import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import queryString from 'query-string';

export default class Results extends Component {
	constructor(props) {
		super(props);
		this.song = queryString.parse(this.props.location.search).song;
		this.playlists = this.props.location.playlists;
		this.renderPlaylists = this.renderPlaylists.bind(this);
	}

	renderPlaylists() {
		const listOfPlaylists = Object.keys(this.playlists).map((playlist_id) =>
			this.playlists[playlist_id]['songs'].includes(this.song) ? (
				<li>{this.playlists[playlist_id]['name']}</li>
			) : null
		);
		return <div>{listOfPlaylists}</div>;
	}

	render() {
		return (
			<div>
				<h1>Song:</h1>
				<h3>{this.song}</h3>
				<hr></hr>
				{this.renderPlaylists()}
			</div>
		);
	}
}
