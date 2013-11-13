// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: Session.get("SortBy")});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click #remove': function()  {
      Players.remove(Session.get("selected_player"));
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
  
  Template.input.events({
      'click #add': function() {
          var valor = $('#cient').val();
          if (valor != ''){
             Players.insert({name : valor , score: Math.floor(Random.fraction()*10)*5});
             $('#cient').val("");
          }
       },
       'click #reset': function() {
           Players.find({}).forEach(function(c) {
               Players.update(c._id, {$set: {score: 0}});
           });
       },
       'click #sortname': function() {
           Session.set("SortBy", {name: 1, score: -1});
       },
       'click #sortscore': function() {
           Session.set("SortBy", {score: -1, name: 1});
       }
       
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
