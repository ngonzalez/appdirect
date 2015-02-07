
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

  default_count: 10,

  initialize: function() {
    this.initValue({ count: this.default_count });
  },

  urlRoot: function() {
    return "http://0.0.0.0:8080/twitter/" +
      "?" + $.param({
        screen_name: this.get('screen_name'),
        count: this.getStorage().count
      });
  },

  initValue: function(hash) {
    var key = Object.keys(hash)[0], value = hash[key];
    if (!this.getStorage() || typeof this.getStorage()[key] == "undefined") {
      this.storeValue(hash);
      this.set(key, value);
    } else {
      this.set(key, this.getStorage()[key]);
    }
  },

  updateValue: function(hash) {
    this.storeValue(hash);
    var key = Object.keys(hash)[0], value = hash[key];
    this.set(key, value);
  },

  storageKey: function() {
    return "demo-app-" + this.get('screen_name');
  },

  storeValue: function(hash) {
    localStorage.setItem(this.storageKey(), JSON.stringify($.extend(this.getStorage(), hash)));
  },

  getStorage: function() {
    return JSON.parse(localStorage.getItem(this.storageKey()));
  }

});

var TwitterUserCollection = Backbone.Collection.extend({
  model: TwitterUser
});

var TwitterUserView = Backbone.View.extend({

  template: _.template($('#item-template-user').html()),

  events: {
      'click .toggle-tools': 'toggleTools',
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
    return this;
  },

  reloadView: function(e) {
    this.render();
    this.loadTweetsContent();
  },

  setCountAndReloadView: function(e) {
    var count = parseInt($(e.target).html());
    if (isNaN(count)) return;
    this.model.updateValue({ count: count })
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

new TwitterUsersView({
  el: $("#twitter-content"),
  collection: new TwitterUserCollection([
    { screen_name: "AppDirect" },
    { screen_name: "laughingsquid" },
    { screen_name: "techcrunch" }
  ])
});
