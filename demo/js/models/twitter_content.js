define([ "backbone", "moment" ], function(Backbone, moment) {

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

  return TwitterContent;

});