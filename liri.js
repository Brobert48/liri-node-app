require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2]
var userinput = process.argv.slice(3).join("_");
var concertuserinput = process.argv.slice(3).join("");


var concert = function(artist){
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
  if (!error && response.statusCode === 200) {
      var api = JSON.parse(body)
      console.log(`
      Upcoming concerts for ${artist}.
      `)
      if(api.length > 0){
      for(var i = 0; i < body.length && i<2; i++){
          console.log(`
    Venue:    ${api[i].venue.name}
    Location: ${api[i].venue.city}
    Date::    ${api[i].datetime}

          `)
      }
  }else{
      console.log(`
     ${userinput} has no upcoming shows. :(
    `)
  }
}})
};
var spot = function(song){
    spotify.search({ type: 'track', query: song , limit: 5})
    .then(function(response) {
        var api = response
          for(i=0;i<api.tracks.items.length;i++){
              console.log(`
    Artist:     ${api.tracks.items[i].album.artists[0].name}
    Song:       ${api.tracks.items[i].name}
    Preview:    ${api.tracks.items[i].preview_url}
    Album:      ${api.tracks.items[i].album.name}
              `)
          }

      })
      .catch(function(err){
          console.log(err)
      }); 
};
var movie = function(title){
    request("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if(userinput){
    if (!error && response.statusCode === 200) {
    console.log(`
    Title:           ${JSON.parse(body).Title}
    Year:            ${JSON.parse(body).Year}
    IMDB Rating:     ${JSON.parse(body).imdbRating}
    Rotten Tomatoes: ${JSON.parse(body).Rotten_Tomatoes}
    Country:         ${JSON.parse(body).Country}
    Language:        ${JSON.parse(body).Language}
    Plot:            ${JSON.parse(body).Plot}
    Actors:          ${JSON.parse(body).Actors}
    `);
  }
}
else{
    request("http://www.omdbapi.com/?t=Mr. Nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log(`
    Title:           ${JSON.parse(body).Title}
    Year:            ${JSON.parse(body).Year}
    IMDB Rating:     ${JSON.parse(body).imdbRating}
    Rotten Tomatoes: ${JSON.parse(body).Rotten_Tomatoes}
    Country:         ${JSON.parse(body).Country}
    Language:        ${JSON.parse(body).Language}
    Plot:            ${JSON.parse(body).Plot}
    Actors:          ${JSON.parse(body).Actors}
    `);
  }
})

}})};
var badCmd = function(){
    console.log(`
    ~~~~~~~~~~~~~~~~~~
    INCORRECT COMMAND!
    Try one of these:
    concert-this ....
    spotify-this-song ....
    movie-this ....
    do-what-it-says
    ~~~~~~~~~~~~~~~~~~
    `)
}

if(command === "concert-this"){
    concert(concertuserinput);
}else if(command === "spotify-this-song"){
    spot(userinput);
}else if(command === "movie-this"){
    movie(userinput);
}else if(command === "do-what-it-says"){
    random();
}else{
    badCmd();
}