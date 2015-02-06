
var localStorageKey = "twitter-client"

var TwitterContent = Backbone.Model.extend({

  initialize: function() {
    this.set('formatted_date', moment(this.get('created_at')).format('MMMM Do YYYY, h:mmA'));
  }

});

var TwitterUser = Backbone.Model.extend({

  urlRoot: function() {
    return "http://0.0.0.0:8080/twitter/" +
      "?" + $.param({
        screen_name: this.get('screen_name'),
        count: this.getCount()
      });
  },

  initCount: function() {
    if (!this.getCount()) {
      this.storeCount(10);
      this.set('count', 10);
    } else {
      this.set('count', this.getCount());
    }
  },

  storageKey: function() {
    return "demo-app-" + this.get('screen_name');
  },

  storeCount: function(count) {
    localStorage.setItem(this.storageKey(), count);
    this.set('count', count);
  },

  getCount: function() {
    return localStorage.getItem(this.storageKey());
  }

});

var TwitterUserCollection = Backbone.Collection.extend({
  model: TwitterUser
});

var TwitterUserView = Backbone.View.extend({

  template: _.template($('#item-template-user').html()),

  initialize: function() {
    this.render();
  },

  render: function() {
    return this.template(this.model.toJSON());
  },

});

var TwitterContentView = Backbone.View.extend({

  template: _.template($('#item-template-tweet').html()),

  initialize: function() {
    this.render();
  },

  render: function() {
    return this.template(this.model.toJSON());
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
      this.element.append(new TwitterContentView({
        model: new TwitterContent(data)
      }).render());
    }, this);
  }

});

var TwitterUsersView = Backbone.View.extend({

  el: $("#twitter-content"),

  initialize: function(collection) {
    this.collection = new TwitterUserCollection(collection);
    this.render();
  },

  render: function() {
    _.each(this.collection.models, function(user) {
      user.initCount();
      this.$el.append(new TwitterUserView({ model: user }).render());
      _.each(this.$el.find("[data-name]"), function(element) {
        if ($(element).attr("data-name") == user.get('screen_name')) {
          this.loadTweetsContent($(element).find(".twitter-content"), user);
        }
      }, this);
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

  setCount: function(e) {

    var count = parseInt($(e.target).html());
    if (isNaN(count)) return;

    var user_container = $(e.target).closest(".user-container");
    var screen_name = user_container.attr("data-name");

    _.each(this.collection.models, function(user) {
      if (user.get('screen_name') == screen_name) {
        user.storeCount(count);
        user_container.find(".twitter-content").html("");
        user_container.find(".title-count").html(count)
        this.loadTweetsContent(user_container.find(".twitter-content"), user);
      }
    }, this);
  },

});

new TwitterUsersView([ { screen_name: "AppDirect" }, { screen_name: "laughingsquid" }, { screen_name: "techcrunch" } ]);

function get_status_url(options) {
  return "http://www.twitter.com/" + options.name + "/status/" + options.id;
}
