const SpotifyWebApi = require('spotify-web-api-node');

// Replace these values with your own client ID and client secret
const clientId = '8497fd1eb5bb4dbaa481fb40dac207d8';
const clientSecret = '849f050086a14cfc875261ba7804b079';

// Create a new instance of the Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

console.log("credential successful")
// Authenticate with the Spotify API
spotifyApi.clientCredentialsGrant().then((data) => {
  spotifyApi.setAccessToken(data.body.access_token);

  spotifyApi.getPlaylistTracks('37i9dQZF1E8TQ0azKAsfW0')
    .then(data => {
      // Extract the list of artist IDs from each track
      const artistIds = data.body.items.map(item => item.track.artists.map(artist => artist.id)).flat();

      // Use the getArtist method to retrieve the genres for each artist ID
      const promises = artistIds.map(artistId => spotifyApi.getArtist(artistId));
      return Promise.all(promises);
    })
    .then(data => {
      // Extract the genres from the artist objects
      const genres = data.map(artist => artist.body.genres).flat();

      // Remove duplicates from the list of genres
      const uniqueGenres = [...new Set(genres)];

      // Log the list of unique genres to the console
      console.log(uniqueGenres);
    })
    .catch(error => console.error(error));
})
.catch(error => console.error(error));

//const delay = ms => new Promise(res => setTimeout(res, ms));

// This function will make a request with a delay of 1 second between each request
//async function makeRequests() {
  //for (let i = 0; i < 10; i++) {
    //await spotifyApi.getArtist(artistIds[i]);
    //await delay(1000); // wait for 1 second before making the next request
  //}
//}