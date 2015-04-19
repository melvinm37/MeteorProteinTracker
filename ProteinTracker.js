
ProteinData = new Meteor.Collection('protein_data');
History = new Meteor.Collection('history');

ProteinData.allow({
  insert: function(userId,data){
    if (data.userId == userId)
      return true;
    return false;
  }
});

Meteor.methods({
  addProtein: function(amount){
    ProteinData.update({userId: this.userId},{$inc:{total: amount}});

    History.insert({
      value: amount,
      date: new Date().toTimeString(),
      userId: this.userId
    });
  }
});


if (Meteor.isClient) {
  // Subscribe to

  Meteor.subscribe('allProteinData');
  Meteor.subscribe('allHistory');

  Deps.autorun(function(){
    if (Meteor.user())
      console.log("User logged in: " + Meteor.user().profile.name);
    else
      console.log("User logged out!");
  });


  Template.userDetails.helpers({
    user: function(){
      var data = ProteinData.findOne();
      if (!data){
        data = {
          userId: Meteor.userId(),
          total: 0,
          goal: 200
        };
        ProteinData.insert(data);

      }
      return data;
    },
    lastAmount : function(){
      return Session.get('lastAmount');
    }
  });

  Template.history.helpers({
    historyItem: function(){
      return History.find({},{sort: {date: -1}});
    }

  });

  Template.userDetails.events({
    'click #addAmount' : function(e){
      e.preventDefault();
      var amount = parseInt($('#amount').val());

      Meteor.call('addProtein',amount,function(error,id){
        if(error)
          return alert("ERROR: Add Protein : " + error.reason);
      });

      Session.set('lastAmount',amount);
    }
  });

}

if (Meteor.isServer) {
  Meteor.publish('allProteinData',function(){
    return ProteinData.find({userId: this.userId});
  });

  Meteor.publish('allHistory',function(){
    return History.find({userId: this.userId},{sort: {date: -1},limit: 5});
  });


  Meteor.startup(function () {


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


