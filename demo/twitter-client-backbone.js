
// https://github.com/moment/moment/issues/1407
moment.createFromInputFallback = function(config) {
  config._d = new Date(config._i)
};

var TwitterContent = Backbone.Model.extend({

  initialize: function() {
    this.set('formatted_date', moment(this.get('created_at')).format('MMMM Do YYYY, h:mmA'));
    this.set('status_url', this.getStatusUrl());
  },

  getStatusUrl: function() {
    var id, name;

    if (this.get('in_reply_to_screen_name')) {

      id = this.get('in_reply_to_status_id_str');
      name = this.get('in_reply_to_screen_name');

    } else if (this.get('retweeted')) {

      id = this.get('retweeted_status').id_str;
      name = this.get('retweeted_status').user.name;

    } else {

      id = this.get('id_str');
      name = this.get('name');

    }

    return "http://www.twitter.com/" + name + "/status/" + id;
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

  events: {
      'click .glyphicon-repeat': 'reloadView',
      'click .tweets-count': 'setCountAndReloadView'
  },

  initialize: function() {
    this.render();
    this.loadTweetsContent();
    this.delegateEvents();
  },

  loadTweetsContent: function() {
    this.model.fetch({
      complete: _.bind(function(data) {
        new TwitterContentsView({
          el: this.$el.find(".twitter-content"),
          collection: data.responseJSON
        });
      }, this)
    });
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  reloadView: function(e) {
    this.render();
    this.loadTweetsContent();
  },

  setCountAndReloadView: function(e) {
    var count = parseInt($(e.target).html());
    if (isNaN(count)) return;
    this.model.storeCount(count);
    this.reloadView();
  }

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

var TwitterUsersView = Backbone.View.extend({

  el: $("#twitter-content"),

  initialize: function(collection) {
    this.collection = new TwitterUserCollection(collection);
    this.render();
  },

  render: function() {
    _.each(this.collection.models, function(user) {
      user.initCount();
      var container = $(document.createElement("div"));
      this.$el.append(container);
      new TwitterUserView({ model: user, el: container }).render()
    }, this);
  }

});

new TwitterUsersView([ { screen_name: "AppDirect" }, { screen_name: "laughingsquid" }, { screen_name: "techcrunch" } ]);

