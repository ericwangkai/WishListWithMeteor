WishList = new Meteor.Collection("wishlist");

function getMyWishes(userId){
    return WishList.find({owner: userId});
};

Meteor.methods({
   createWishItem: function (options, userId) {
       
       console.log("Parameter -> ", JSON.stringify(options));
       options = options || {};
       if(!(typeof options.productDesc === "string" && options.productDesc.length)){
           throw new Meteor.Error(400, "Required parameter missing");
       }
       
       //if( typeof options.price === "string" && options.price || options.price === 0)
       var owner = userId || this.userId ;
       if(!owner){
            throw new Meteor.Error(403, "You must be logged in")
       }        
       
        console.log("UserID -> " + owner);
        
        var wishId = WishList.insert({
            text: options.productDesc,
    	    price: options.price,
            url: options.productURL,
            owner: owner,
            created_date: (new Date()).getTime()
        });
        
        console.log("WishList -> " + WishList.find({owner: owner}).count());
        return wishId;
   },
   
   getAllMyWishes: function(options){
       console.log("current User -> " + this.userId);
       return WishList.find({owner: this.userId}).fetch();
   }
});