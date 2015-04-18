
Users = new Meteor.Collection('protein_data');
History = new Meteor.Collection('history');


if (Meteor.isClient) {
  // Subscribe to

  Meteor.subscribe('allUsers');
  Meteor.subscribe('allHistory');


  Template.userDetails.helpers({
    user: function(){
      return Users.findOne();
      }
  });

  Template.history.helpers({
    historyItem: function(){
      return History.find({},{sort: {date: -1}, limit: 5});
    }

  });

  Template.userDetails.events({
    'click #addAmount' : function(e){
      e.preventDefault();
      var amount = parseInt($('#amount').val());
      Users.update(this._id,{$inc:{total: amount}});

      History.insert({
        value: amount,
        date: new Date().toTimeString(),
        userId: this._id
      });
    }
  });

}

if (Meteor.isServer) {
  Meteor.publish('allUsers',function(){
    return Users.find();
  });

  Meteor.publish('allHistory',function(){
    return History.find();
  });


  Meteor.startup(function () {
    if (Users.find().count()===0){
      Users.insert({
        total: 120,
        goal: 200
      });
    }
    if (History.find().count() ===0){
      History.insert({
        value: 50,
        date: new Date().toTimeString()
      });

      History.insert({
        value: 30,
        date: new Date().toTimeString()
      });

      History.insert({
        value: 40,
        date: new Date().toTimeString()
      });

      History.insert({
        value: 20,
        date: new Date().toTimeString()
      });
      History.insert({
        value: 10,
        date: new Date().toTimeString()
      });
    }

      Accounts.loginServiceConfiguration.remove({
        service: "google"
      });
      Accounts.loginServiceConfiguration.insert({
        service: "google",
        clientId: "656952405114-vrfokjhhqk9sn7fvql04dl7k9b0bsue8.apps.googleusercontent.com",
        secret: "omEJ3NgG3QSe6QojRuQyGCjJ"
      });

       //   "loginStyle" : "popup"}



  });
}


