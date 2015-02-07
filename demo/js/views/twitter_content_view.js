define([ "backbone" ], function(Backbone) {

  var TwitterContentView = Backbone.View.extend({

    template: _.template($('#item-template-tweet').html()),

    initialize: function() {
      this.render();
    },

    render: function() {
      return this.template(this.model.toJSON());
    }

  });

  return TwitterContentView;

});