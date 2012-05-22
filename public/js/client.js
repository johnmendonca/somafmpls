$(function() {
  SongTweet = Backbone.Model.extend({
    defaults: {
      id_str: "12345",
      text: "Dope Song"
    }
  });

  Playlist = Backbone.Model.extend({
    defaults: {
      id_str: "12345",
      screen_name: "Dope Station",
      description: "This is what this music is...",
      profile_image_url: "",
      followers_count: 0
    }
  });

  Playlists = Backbone.Collection.extend({
  });

  GridView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');
      this.render();
    },
    
    render: function() {
      this.$el.append(new PlaylistView().render().el);
      return this;
    }
  });

  PlaylistView = Backbone.View.extend({
    plsTemplate: _.template($("#playlist-template").html()),

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      this.el = this.plsTemplate({});
      return this;
    }
  });

  ItemView = Backbone.View.extend({ 
    tagName: "li",
    initialize: function() {
    },
    render: function() {
    }
  });

  appView = new GridView({el: $("#pls_container")});
  var socket = io.connect('http://localhost:3000');
  socket.on('tweet', function(data) {
    $('.pls_body ul').append('<li>' + data.text + '</li>');
  });
});
