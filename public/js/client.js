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
      profile_image_url: ""
    },
    sync: function() {}
  });

  /*
   * Main collection that receives messages from the socket
   */
  Playlists = Backbone.Collection.extend({
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
    }
  });

  GridView = Backbone.View.extend({
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

  PlaylistView = Backbone.View.extend({
    plsTemplate: _.template($("#playlist-template").html()),

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      this.el = this.plsTemplate(this.model.toJSON());
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

  appView = new GridView({
    el: $("#pls_container"),
    collection: new Playlists()
  });
});
