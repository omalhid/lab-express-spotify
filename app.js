require("dotenv").config();

const express = require("express");
const hbs = require("hbs");



// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
    
});
console.log(process.env.CLIENT_ID);
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:

//route for home page
app.get("/" , (req,res) => {
    res.render("index")
})


app.get("/artist-search", (req, res) => {
  const { artistName } =req.query;
    spotifyApi
    .searchArtists(artistName)
    .then(data => {
      console.log("Searched artist", data.body.artists.items[0]);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artists = data.body.artists.items 
      res.render("artist-search", { artists })
    })
    .catch(err => console.log("The error while searching artists occurred: ", err));
})

app.get("/albums/:artistId", (req, res, next) => {
  const artistId=req.params.artistId;
  spotifyApi
  .getArtistAlbums(artistId)
  .then((data)=> {
    console.log("Artist's albums", data.body);
    const albums=data.body.items;
    res.render("albums", {albums})
  })
  .catch(err => console.log('The error while getting artist albums: ', err));
})

app.get("/albums/:albumId", (req, res, next) => {
  const albumId=req.params.albumId;
  spotifyApi
  .getArtistAlbums(albumId)
  .then((data)=> {
    console.log("Album's tracks", data.body);
    const tracks=data.body.items;
    res.render("tracks", {tracks})
  })
  .catch(err => console.log('The error while getting albums tracks: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
