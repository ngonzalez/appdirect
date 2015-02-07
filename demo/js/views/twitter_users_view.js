define([ "backbone", "views/twitter_user_view" ], function(Backbone, TwitterUserView) {

  var TwitterUsersView = Backbone.View.extend({

    initialize: function() {
      this.render();
    },

    render: function() {
      _.each(this.collection.models, function(user) {
        var container = $(document.createElement("div"));
        this.$el.append(container);
        new TwitterUserView({ model: user, el: container }).render();
      }, this);
    }

  });

  return TwitterUsersView;

});