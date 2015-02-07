require.config({
  'baseUrl': 'js',
  'paths': {
    'jquery': 'vendor/jquery/jquery-1.11.2.min',
    'underscore': 'vendor/underscore/underscore-min',
    'backbone': 'vendor/backbone/backbone-min',
    'handlebars': 'vendor/handlebars/handlebars-v2.0.0',
    'bootstrap': 'vendor/bootstrap/bootstrap.min',
    'moment': 'vendor/moment/moment.min'
  },
  'shim': {
    'underscore': {
      'exports': '_'
    },
    'bootstrap': {
      'deps': ['jquery']
    },
    'backbone': {
      'deps': ['jquery', 'underscore'],
      'exports': 'Backbone'
    }
  }
});

require([
    "jquery",
    "backbone",
    "moment",
    "views/twitter_users_view",
    "collections/twitter_user_collection"
  ],
  function($, Backbone, moment, TwitterUsersView, TwitterUserCollection) {
    $(function() {

      // https://github.com/moment/moment/issues/1407
      moment.createFromInputFallback = function(config) {
        config._d = new Date(config._i)
      };

      new TwitterUsersView({
        el: $("#twitter-content"),
        collection: new TwitterUserCollection([
          { screen_name: "AppDirect" },
          { screen_name: "laughingsquid" },
          { screen_name: "techcrunch" }
        ])
      });

    });
  }
);