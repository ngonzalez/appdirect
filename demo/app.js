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
      'deps': ['underscore'],
      'exports': 'Backbone'
    }
  }
});

require([
    "jquery",
    "views/twitter_users_view",
    "collections/twitter_user_collection"
  ],
  function($, TwitterUsersView, TwitterUserCollection) {

    new TwitterUsersView({
      el: $("#twitter-content"),
      collection: new TwitterUserCollection([
        { screen_name: "AppDirect" },
        { screen_name: "laughingsquid" },
        { screen_name: "techcrunch" }
      ])
    });

  }
);