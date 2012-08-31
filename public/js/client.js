$(function() {
  var Playlist = Backbone.Model.extend({
    defaults: {
      id_str: "12345",
      screen_name: "Dope Station",
      description: "This is what this music is...",
      profile_image_url: ""
    },

    initialize: function() {
      _.bindAll(this, 'receive');
      this.songs = [];
    },

    sync: function() {},

    receive: function(data) {
      var song = data.text.replace(/♬[^♬]*$/, '');
      this.songs.unshift(song);
      this.trigger('change:songs', song);
    }
  });

  /* Main collection that receives messages from the socket */
  var Playlists = Backbone.Collection.extend({
    initialize: function() {
      _.bindAll(this, 'receive');
      this.socket = io.connect('http://localhost:3000');
      this.socket.on('tweet', this.receive);
    },

    model: Playlist,
    sync: function() {},

    receive: function(data) {
      var playlist = this.find(function(pls) { return pls.get('screen_name') == data.user.screen_name; });
      if (!playlist) {
        playlist = this.create(data.user);
      }
      playlist.receive(data);
    }
  });

  /* View for entire grid of playlists, tied to playlists collection. */
  var GridView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render', 'addPlaylist');
      this.collection.on('add', this.addPlaylist);
      this.render();
    },

    //value used to generate bootstrap grid
    //don't set higher than 6
    columns: 3, 
    playlistViews: [],
    
    addPlaylist: function(pls) {
      var plsView = new PlaylistView({model: pls});
      var length = this.playlistViews.push(plsView);
      var index = length - 1;
      var rowIndex = Math.floor(index / this.columns);
      var columnIndex = index % this.columns;
      var columnSpan = 12 / this.columns; //12 is a twitter bootstrap constant

      if (columnIndex == 0) {  //we need a new row
        var row = $('<div id="row' + rowIndex + '" class="row"></div>');
        this.$el.append(row);
      } else { //the row already exists
        var row = $('#row' + rowIndex);
      }

      var column = $('<div id="column' + index + '" class="span' + columnSpan + '"></div>');
      column.append(plsView.render().el);
      row.append(column);
    },

    render: function() {
      return this;
    }
  });

  /* View for a single playlist */
  var PlaylistView = Backbone.View.extend({
    template: _.template($("#playlist-template").html()),

    initialize: function() {
      _.bindAll(this, 'render','addSong');
      this.model.on('change:songs', this.addSong);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    addSong: function(song) {
      this.$el.find('.pls_body ul').prepend('<li>' + song + '</li>');
    }
  });

  var appView = new GridView({
    el: $("#pls_container"),
    collection: new Playlists()
  });
});
