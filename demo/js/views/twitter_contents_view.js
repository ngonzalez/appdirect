define([ "backbone", "views/twitter_content_view", "models/twitter_content" ], function(Backbone, TwitterContentView, TwitterContent) {

  var TwitterContentsView = Backbone.View.extend({

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html("");
      _.each(this.collection, function(data) {
        this.$el.append(new TwitterContentView({
          model: new TwitterContent(data)
        }).render());
      }, this);
    }

  });

  return TwitterContentsView;

});