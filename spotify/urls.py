from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    # path('get-playlists', GetPlaylists.as_view()),
    path('get-songs-from-playlists', GetSongsFromPlaylists.as_view())
]
