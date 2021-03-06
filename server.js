/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var axios = require("axios");
var puppeteer = require("puppeteer")
require("dotenv").config();

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = process.env.redirect_uri || 'http://localhost:3000/callback'; // Your redirect uri

const PORT = process.env.PORT || 3000;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

//this will hold our colors sent to us from the front end
var hex_1;
var hex_2;
var hex_3;
var hex_4;
var hex_5;

app.post("/:hex1/:hex2/:hex3/:hex4/:hex5", function (req, res) {
  hex_1 = req.params.hex1;
  hex_2 = req.params.hex2;
  hex_3 = req.params.hex3;
  hex_4 = req.params.hex4;
  hex_5 = req.params.hex5;

  res.sendStatus(200)
})

app.get("/scrape", async function (req, res) {
  
  var url = `https://artsexperiments.withgoogle.com/artpalette/colors/${hex_1}-${hex_2}-${hex_3}-${hex_4}-${hex_5}`

  var img_data = await webscrape(url);

  if (img_data === 404) {
    res.sendStatus(404);
  }

  res.json(img_data);

})


async function webscrape(url) {

  var browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  var page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  const img_data = await page.evaluate(function () {

    var data = []; 

    var other_results = document.querySelectorAll(".result-item");

    try {
      for ( var i = 0; i < 50; i++) {
        var other_result_img_src = other_results[i].children[0].firstElementChild.getAttribute("src");
  
        var other_result_src = other_results[i].children[1].getAttribute("href");
  
        data.push({
          img_url: other_result_img_src,
          img_src: other_result_src
        })
      }
    }
    catch {
      return 404;
    }

    

    return data;
  })

  await browser.close()

  return img_data;
}

app.listen(PORT, function () {
  console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT)
})
