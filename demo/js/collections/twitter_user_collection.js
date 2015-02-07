define([ "backbone", "models/twitter_user" ], function(Backbone, TwitterUser) {

  var TwitterUserCollection = Backbone.Collection.extend({
    model: TwitterUser
  });

  return TwitterUserCollection;

});