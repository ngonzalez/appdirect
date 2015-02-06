
var TwitterUser = Backbone.Model.extend({

  urlRoot: function() {
    return "http://0.0.0.0:8080/twitter/" +
      "?" + $.param($.extend(this.attributes, { count: 10 }));
  }

});

var TwitterContent = Backbone.Model.extend({});

var TwitterUserCollection = Backbone.Collection.extend({
  model: TwitterUser
});

var TwitterContentCollection = Backbone.Collection.extend({
  model: TwitterContent
});

var TwitterUserView = Backbone.View.extend({

  template: _.template($('#item-template-user').html()),

  initialize: function(item) {
    this.model = item.model;
    this.render();
  },

  render: function() {
    return this.template(this.model);
  },

});

var TwitterContentView = Backbone.View.extend({

  template: _.template($('#item-template-tweet').html()),

  initialize: function(item) {
    this.model = item.model;
    this.render();
  },

  render: function() {
    return this.template($.extend(_(this.model).pick("id", "text"), {
      date: moment(this.model.created_at).format('MMMM Do YYYY, h:mmA')
    }));
  }

});

var TwitterContentsView = Backbone.View.extend({

  initialize: function(element, collection) {
    this.collection = collection;
    this.element = element;
    this.render();
  },

  render: function() {
    _.each(this.collection, function(data) {
      this.element.append(new TwitterContentView({ model: data }).render());
    }, this);
    return this;
  },

});

var TwitterUsersView = Backbone.View.extend({

  el: $("#twitter-content"),

  initialize: function(collection) {
    this.collection = new TwitterUserCollection(collection).models;
    this.render();
  },

  render: function() {
    _.each(this.collection, function(user) {
      this.$el.append(new TwitterUserView({ model: user.attributes }).render());
      user.fetch({
        complete: _.bind(function(data) {
          new TwitterContentsView(this.$el.find(".twitter_content"), data.responseJSON)
        }, this)
      });
    }, this);
    return this;
  }

});

new TwitterUsersView([ { screen_name: "nico121" } ]);

