define([ "backbone", "moment", "handlebars" ], function(Backbone, moment, Handlebars) {

  var TwitterContent = Backbone.Model.extend({

    twitterUrl: "http://www.twitter.com/",

    initialize: function() {
      this.set('status_url', this.getStatusUrl());
      this.set('formatted_date', this.getFormattedDate());
      this.set('formatted_content', this.getFormattedContent());
    },

    getStatusUrl: function() {
      var id, name;

      if (this.get('in_reply_to_screen_name')) {
        if (this.get('in_reply_to_status_id_str')) {
          id = this.get('in_reply_to_status_id_str');
        } else if (this.get('in_reply_to_user_id_str')) {
          id = this.get('in_reply_to_user_id_str');
        }
        name = this.get('in_reply_to_screen_name');
      } else if (this.get('retweeted')) {
        id = this.get('retweeted_status').id_str;
        name = this.get('retweeted_status').user.name;
      } else {
        id = this.get('id_str');
        name = this.get('user').name;
      }

      return this.twitterUrl + name + "/status/" + id;
    },

    link: function(options) {
      return $("<a />")
        .attr("href", options.href)
        .attr("target", "_blank")
        .html(options.content)
        .prop("outerHTML");
    },

    getFormattedDate: function() {
      return this.link({ href: this.getStatusUrl(), content: moment(this.get('created_at')).fromNow() });
    },

    getFormattedContent: function() {
      return this.get('text')
        .replace(/(https?:\/\/[^\s]+)/g, this.link({ href: "$1", content: "$1" }))
        .replace(/@(\w+)/g, this.link({ href: this.twitterUrl + "$1", content: "@$1" }))
    }

  });

  return TwitterContent;

});