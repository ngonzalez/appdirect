define([ "backbone" ], function(Backbone) {

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

  return TwitterUser;

});
