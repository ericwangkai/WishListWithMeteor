Meteor.publish("myWishList", function () {
    console.log("Server UserID -> " + this.userId);
    var list = getMyWishes(this.userId);
    console.log("Server List Size -> " + list.count());
    return list;
});

Meteor.startup(function () {
  // code to run on server at startup
  
  Meteor.Router.add({
	  '/testAPI': 'SUCCESS'
  })
  
  
  Meteor.Router.add('/addToWishlist', 'POST', function() {
      
      var userId = this.request.body.userId;
      if(!userId){
         throw new Meteor.Error(403, "Illegal Call without Token");           
      }
      
      var wishId = Meteor.call('createWishItem', {
        productDesc: this.request.body.productDesc,
        price: this.request.body.productPrice
      }, userId);
	  
	  console.log(WishList.findOne(wishId));
  })// Just check the
  
  Meteor.Router.add('/login', 'POST', function() {
      var userId = this.request.body.email;
      var password = this.request.body.password;
      
      console.log("User " + userId + " is trying to login.");
      
      var user = Meteor.users.findOne({"emails.address": userId});
      if (!user)
        throw new Meteor.Error(403, "User not found");
      
      console.log("User -> " + JSON.stringify(user._id));
    
      
      if (!user.services || !user.services.password || !user.services.password.srp)
        throw new Meteor.Error(403, "User has no password set");

      // Just check the verifier output when the same identity and salt
      // are passed. Don't bother with a full exchange.
      var verifier = user.services.password.srp;
      var newVerifier = Meteor._srp.generateVerifier(password, {
        identity: verifier.identity, salt: verifier.salt});
    
      if (verifier.verifier !== newVerifier.verifier)
        throw new Meteor.Error(403, "Incorrect password");
      else
        console.log("Authentication is successful");
        
        console.log("UserID" + user._id);
        
      return JSON.stringify({"userId": user._id});
  })
  
});