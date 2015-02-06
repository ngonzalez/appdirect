
var http    = require('http'),
    _       = require('underscore'),
    Twitter = require('twitter'),
    express = require('express'),
    cors    = require('cors');

var app = express();

app.use(cors());

app.get('/twitter', function(req, res) {

  if (_.contains([ "nico121", "AppDirect", "laughingsquid", "techcrunch" ], req.query.screen_name)) {

    var count = parseInt(req.query.count);
    if (isNaN(count) || count > 10) count = 10;

    var client = new Twitter({
      consumer_key: 'bcfF5ANZ8qnicUaqG5CJsSUcw',
      consumer_secret: 'GtjiSE5DcubFBfJIyEXIDTGRjVKrbvkyHMPeExQceBdjcEFTKQ',
      access_token_key: '8845342-tckLYcT9ZsStyaDqkD3y0GMQqRTIK8wLBtML4QKUj0',
      access_token_secret: 'LoHmKh70mGcHg77YQd7RA95JThRTdnuTZ8V8FkVIdvw0S'
    });

    client.get('statuses/user_timeline', { screen_name: req.query.screen_name, count: count }, function(error, tweets, response) {
      if (!error) {
        res.status(200).json(tweets);
      } else {
        res.status(500).json({ error: "Failed to contact Twitter" });
      }
    });

    // res.status(200).json({ ok: "OK" });

  } else {

    res.status(500).json({ invalid_query: req.query });

  }

});

var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Server started: http://%s:%s', host, port)

});

