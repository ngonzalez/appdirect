define([ "backbone", "views/twitter_contents_view", "collections/twitter_content_collection", "bootstrap" ], function(Backbone, TwitterContentsView, TwitterContentCollection) {

  var TwitterUserView = Backbone.View.extend({

    template: _.template($('#item-template-user').html()),

    events: {
        'click .toggle-tools': 'toggleTools',
        'click .glyphicon-repeat': 'reloadView',
        'click .tweets-count': 'setCountAndReloadView'
    },

    initialize: function() {
      this.render();
      this.delegateEvents();
    },

    loadTweetsContent: function() {
      this.model.fetch({
        complete: _.bind(function(data) {
          new TwitterContentsView({
            el: this.$el.find(".twitter-content"),
            collection: new TwitterContentCollection(data.responseJSON)
          });
        }, this)
      });
    },

    displayTooltips: function() {
      this.$el.find('[data-toggle="tooltip"]').tooltip();
    },

    toggleTools: function(e) {

      var tools = this.$el.find(".tools"),
          tools_toggle = this.$el.find(".toggle-tools");

      if (tools.is(":visible")) {
        tools.addClass("hidden");
        tools_toggle.removeClass("glyphicon-chevron-up");
        tools_toggle.addClass("glyphicon-chevron-down");
      } else {
        tools.removeClass("hidden");
        tools_toggle.addClass("glyphicon-chevron-up");
        tools_toggle.removeClass("glyphicon-chevron-down");
      }
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.displayTooltips();
      this.loadTweetsContent();
      return this;
    },

    reloadView: function(e) {
      this.render();
    },

    setCountAndReloadView: function(e) {
      var count = parseInt($(e.target).html());
      if (isNaN(count)) return;
      this.model.updateValue({ count: count })
      this.reloadView();
    }

  });

  return TwitterUserView;

});
