define([ "backbone", "handlebars" ], function(Backbone, Handlebars) {

  var TwitterContentView = Backbone.View.extend({

    template: Handlebars.compile($("#item-template-tweet").html()),

    initialize: function() {
      this.render();
    },

    render: function() {
      return this.template(this.model.toJSON());
    }

  });

  return TwitterContentView;

});