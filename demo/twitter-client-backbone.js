
var localStorageKey = "twitter-client"

var TwitterUser = Backbone.Model.extend({

  urlRoot: function() {
    return "http://0.0.0.0:8080/twitter/" +
      "?" + $.param({
        screen_name: this.attributes.screen_name,
        count: localStorage.getItem("demo-app-" + this.attributes.screen_name)
      });
  }

});

var TwitterUserCollection = Backbone.Collection.extend({
  model: TwitterUser
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
    return this.template($.extend(this.model, {
      date: moment(this.model.created_at).format('MMMM Do YYYY, h:mmA')
    }));
  }

});

var TwitterContentsView = Backbone.View.extend({

  initialize: function(element, collection) {
    this.element = element;
    this.collection = collection;
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
      this.displayTweets(user)
    }, this);
  },

  displayTweets: function(user) {
    this.initCount(user);
    this.$el.append(new TwitterUserView({ model: $.extend(user.attributes, { count: this.getCount(user) }) }).render());
    _.each(this.$el.find("[data-name]"), function(element) {
      if ($(element).attr("data-name") == user.attributes.screen_name) {
        this.loadTweetsContent($(element).find(".twitter_content"), user);
      }
    }, this);
  },

  loadTweetsContent: function(element, user) {
    user.fetch({
      complete: _.bind(function(data) {
        new TwitterContentsView(element, data.responseJSON);
      }, this)
    });
  },

  events: {
      'click .tweets-count': 'setCount'
  },

  initCount: function(user) {
    if (!this.getCount(user)) {
      this.storeCount(user.attributes.screen_name, 10);
    }
  },

  getCount: function(user) {
    return localStorage.getItem("demo-app-" + user.attributes.screen_name);
  },

  setCount: function(e) {

    var user_container = $(e.target).closest(".user-container");
    var screen_name = user_container.attr("data-name");
    var count = parseInt($(e.target).html());

    this.storeCount(screen_name, count);
    _.each(this.collection, function(user) {
      if (user.attributes.screen_name == screen_name) {
        user_container.find(".twitter_content").html("");
        user_container.find(".title-count").html(count)
        this.loadTweetsContent(user_container.find(".twitter_content"), user);
      }
    }, this);
  },

  storeCount: function(screen_name, count) {
    localStorage.setItem("demo-app-" + screen_name, count);
  }

});

new TwitterUsersView([ { screen_name: "AppDirect" }, { screen_name: "laughingsquid" }, { screen_name: "techcrunch" } ]);

function get_status_url(options) {
  return "http://www.twitter.com/" + options.name + "/status/" + options.id;
}
