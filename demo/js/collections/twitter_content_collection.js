define([ "backbone", "models/twitter_content" ], function(Backbone, TwitterContent) {

  var TwitterContentCollection = Backbone.Collection.extend({
    model: TwitterContent
  });

  return TwitterContentCollection;

});