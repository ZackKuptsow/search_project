import json
import time
from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from requests import Request, post
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .models import SpotifyToken
from .util import *


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'playlist-read-private playlist-read-collaborative'
        # TODO: if song isn't in any playlist search spotify, scope not needed just authorized user
        # TODO: get track from playlist, artist from track, genre from artist
        print('\nAUTH\n')

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, refresh_token, expires_in)

    return redirect('client:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


# class GetPlaylists(APIView):
#     def get(self, request, format=None):
#         user_key = self.request.session.session_key
#         endpoint = 'me/playlists'
#         query = '?limit=50'
#         response = execute_spotify_api_call(user_key, endpoint, query)

#         return Response(response, status=status.HTTP_200_OK)


class GetSongsFromPlaylists(APIView):
    def get(self, request, format=None):
        user_key = self.request.session.session_key
        endpoint = 'me/playlists'
        query = '?limit=50'
        # query = '?limit=5'
        playlist_response = execute_spotify_api_call(user_key, endpoint, query)
        playlists = {}
        for playlist in playlist_response['items']:
            playlists[playlist['id']] = {
                'name': playlist['name'], 'songs': []}

        for id in playlists.keys():
            endpoint = 'playlists/' + id
            response = execute_spotify_api_call(user_key, endpoint)
            error_response = []
            for song in response['tracks']['items']:
                try:
                    playlists[id]['songs'].append(song['track']['name'])
                except:
                    error_response.append(song['track'])

        print(json.dumps(playlists, indent=4))
        print(error_response)

        return Response(playlists, status=status.HTTP_200_OK)
