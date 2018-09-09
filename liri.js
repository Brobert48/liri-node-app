require("dotenv").config();
var keys = require('./keys.js');
var fs = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
moment().format();

var command = process.argv[2];
var defaultinput = process.argv.slice(3).join(" ");
var userinput = process.argv.slice(3).join("_");
var spotifyuserinput = process.argv.slice(3).join("%20");
var concertuserinput = process.argv.slice(3).join("");


var concert = function (artist) {
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var api = JSON.parse(body)
            console.log(`
      Upcoming concerts for ${artist}.
      `)
            if (api.length > 0) {
                var display = [];
                for (var i = 0; i < body.length && i < 2; i++) {
                    var date = moment(api[i].datetime, moment.ISO_8601).format('MM/DD/YYYY');
                    var event = `
    Venue:    ${api[i].venue.name}
    Location: ${api[i].venue.city}
    Date::    ${date}

          `
                    console.log(event)
                    display.push(event);
                }
                log(command, defaultinput, display)
            } else {
                var display =
                    `
     ${userinput} has no upcoming shows. :(
    `
                console.log(display);
                log(command, defaultinput, display);

            }
        }
    })
};
var spot = function (song) {
    var display = [];
    if (song) {
        spotify.search({ type: 'track', query: song, limit: 5 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } else {
                var api = data
                for (i = 0; i < api.tracks.items.length; i++) {
                    var track = `
    Artist:     ${api.tracks.items[i].album.artists[0].name}
    Song:       ${api.tracks.items[i].name}
    Preview:    ${api.tracks.items[i].preview_url}
    Album:      ${api.tracks.items[i].album.name}
              `
                    display.push(track);
                    console.log(track);
                }
                log(command, defaultinput, display);

            }
        });

    } else {
        spotify.search({ type: 'track', query: 'The Sign Ace of Base', limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } else {
                var api = data
                for (i = 0; i < api.tracks.items.length; i++) {
                    var defaulttrack = `
    Artist:     ${api.tracks.items[i].album.artists[0].name}
    Song:       ${api.tracks.items[i].name}
    Preview:    ${api.tracks.items[i].preview_url}
    Album:      ${api.tracks.items[i].album.name}
              `
                    display.push(defaulttrack);
                    console.log(defaulttrack);
                }
                log(command, defaultinput, display);

            }
        });

    }
};
var movie = function (title) {
    var display = [];
    request("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (userinput) {
            if (!error && response.statusCode === 200) {
                var output = `
    Title:           ${JSON.parse(body).Title}
    Year:            ${JSON.parse(body).Year}
    IMDB Rating:     ${JSON.parse(body).imdbRating}
    Rotten Tomatoes: ${JSON.parse(body).Rotten_Tomatoes}
    Country:         ${JSON.parse(body).Country}
    Language:        ${JSON.parse(body).Language}
    Plot:            ${JSON.parse(body).Plot}
    Actors:          ${JSON.parse(body).Actors}
    `;
                display.push(output);
                console.log(output);
            }
            log(command, defaultinput, display);
        }
        else {
            request("http://www.omdbapi.com/?t=Mr. Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var output = `
    Title:           ${JSON.parse(body).Title}
    Year:            ${JSON.parse(body).Year}
    IMDB Rating:     ${JSON.parse(body).imdbRating}
    Rotten Tomatoes: ${JSON.parse(body).Rotten_Tomatoes}
    Country:         ${JSON.parse(body).Country}
    Language:        ${JSON.parse(body).Language}
    Plot:            ${JSON.parse(body).Plot}
    Actors:          ${JSON.parse(body).Actors}
    `;
                    display.push(output);
                    console.log(output);
                }
                log(command, defaultinput, display);

            })

        }
    })
};
var badCmd = function () {
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
var random = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var data = data.replace("\"", "");
        data = data.replace("\"", "");
        var words = data.split(',');
        if (words[0] === "concert-this") {
            concert(words[1]);
        } else if (words[0] === "spotify-this-song") {
            spot(words[1]);
        } else if (words[0] === "movie-this") {
            movie(words[1]);
        } else {
            badCmd();
        }
    })
};
var log = function (com, input, output) {
    fs.appendFileSync("log.txt", "\n" + com + " " + input + " " + output);
}

if (command === "concert-this") {
    concert(concertuserinput);
} else if (command === "spotify-this-song") {
    spot(spotifyuserinput);
} else if (command === "movie-this") {
    movie(userinput);
} else if (command === "do-what-it-says") {
    random();
} else {
    badCmd();
}