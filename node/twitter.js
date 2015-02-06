
var http    = require('http'),
    _       = require('underscore'),
    Twitter = require('twitter'),
    express = require('express'),
    cors    = require('cors');

var app = express();

app.use(cors());

app.get('/twitter', function(req, res) {

  var count = parseInt(req.query.count);
  if (isNaN(count) || count > 30) count = 10;

  var client = new Twitter({
    consumer_key: 'CONSUMER_KEY',
    consumer_secret: 'CONSUMER_SECRET',
    access_token_key: 'ACCESS_TOKEN_KEY',
    access_token_secret: 'ACCESS_TOKEN_SECRET'
  });

  client.get('statuses/user_timeline', { screen_name: req.query.screen_name, count: count }, function(error, tweets, response) {
    if (!error) {
      res.status(200).json(tweets);
    } else {
      res.status(500).json({ error: "Failed to contact Twitter" });
    }
  });

});

var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Server started: http://%s:%s', host, port)

});

