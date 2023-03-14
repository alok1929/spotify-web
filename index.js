const CLIENT_ID = '8497fd1eb5bb4dbaa481fb40dac207d8';
const REDIRECT_URI = 'http://localhost:3000/callback';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  url: 'http://localhost'
});

// Simulate the window and document objects
global.window = dom.window;
global.document = dom.window.document;

// Initialize the Spotify Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
  const player = new Spotify.Player({
    name: 'My Web Playback SDK Player',
    getOAuthToken: callback => {
      // Use the Authorization Code Flow to authenticate the app
      if (window.location.hash.includes('access_token')) {
        // If the access token is already in the URL hash, use it
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        callback(accessToken);
      } else {
        // If the access token is not in the URL hash, redirect the user to the authorization page
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-playback-state,user-modify-playback-state`;
        window.location.href = authUrl;
      }
    }
  });

  // Connect to the player
  player.connect();

  player.addListener('ready', ({ device_id }) => {
    // Start playing a playlist
    fetch(`https://api.spotify.com/v1/playlists/YOUR_PLAYLIST_ID/tracks`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M', 'spotify:track:6u7jPi22kF8CTQ3rb9DHE7'] // replace with your desired track URIs
      })
    }).then(() => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    });
  });
};