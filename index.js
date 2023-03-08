const express=require('express')


client_id="8497fd1eb5bb4dbaa481fb40dac207d8"
client_secret="465a2c4dd6a6406d8ebc5d653686cd5c"
var redirect_uri = 'http://localhost:8888/callback';

var app = express();

const queryString = require("querystring");
const axios = require("axios");

app.get("/account", async (req, res) => {
  const spotifyResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      queryString.stringify({
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: redirect_uri,
      }),
      {
        headers: {
          Authorization: "Basic " + client_secret,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  
  console.log(spotifyResponse.data);
})
const data = axios.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=50",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse,
      },
    }
  );

  console.log(data)