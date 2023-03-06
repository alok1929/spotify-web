const qs=require('qs')
require('dotenv').config();
const express = require("express");
const app = express();

app.listen(8080, () => {
  console.log("App is listening on port 8080!\n");
});

const queryString = require("node:querystring");
const axios = require("axios");

app.get("/account", async (req, res) => {
  const spotifyResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      queryString.stringify({
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.REDIRECT_URI_DECODED,
      }),
      {
        headers: {
          Authorization: "Basic " + process.env.BASE64_AUTHORIZATION,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  
  console.log(spotifyResponse.data);
})