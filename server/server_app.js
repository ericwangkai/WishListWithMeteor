WishList = new Meteor.Collection("wishlist");

Meteor.startup(function () {
  // code to run on server at startup
  Meteor.Router.add({
	  '/testAPI': 'SUCCESS'
  });
  
  
  Meteor.Router.add('/wishlist', 'POST', function() {	  
	  var wishID = WishList.insert({
		'text' : this.request.body.productDesc,
		'price' : this.request.body.productPrice
	  });
	  
	  console.log(WishList.findOne(wishID));
  });
  
  
  
});