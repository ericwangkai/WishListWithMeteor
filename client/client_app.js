//WishList = new Meteor.Collection("wishlist");

Meteor.subscribe('myWishList');

Session.setDefault('editing_itemname', null);

Template.rightboard.events({
	'keyup #new-wish': function(e,t){
		if(e.which === 13 && e.target.value !== ""){
    		addNewWish(e.target.value, "");
			e.target.value = "";
		}
	},
    'click #search-51-button': function(e,tmpl){    	
		//Meteor.http.get("GET", "http://www.51bi.com/search/?keyword=" + e.target.value, followRedirects=true);
        if( tmpl.find("#new-wish").value !== ""){
		    Router.goSearch("http://www.51bi.com/search/?keyword=" + tmpl.find("#new-wish").value);
        }
	},
    'click #add-to-button': function(e,tmpl){     
        var value = tmpl.find("#new-wish").value;
		if(value !== ""){
    		addNewWish(value, "");
			tmpl.find("#new-wish").value = "";
		}
	}
    
});

Template.rightboard.wishList = function(){
    console.log("Client WishList -> " + WishList.find().count());
    return WishList.find({});
};

Template.wish_item.editing = function(){
	return Session.equals('editing_itemname', this._id);
};

Template.wish_item.events({
	'dblclick .wishItem': function(evt, tmpl){
		Session.set('editing_itemname', this._id);
		Deps.flush();
		activateInput(tmpl.find("#wish-item-input"));
	},/*
	'keyup #wish-item-input': function(e,t){
		if(e.which === 13){
			updateWish(e.target.value, this._id);
			Session.set('editing_itemname', null);
		}
	},*/
	'keydown #wish-item-input': function(e,t){
		if(e.which === 27){
			Session.set('editing_itemname', null);
		}
	},
	'click #search-button-in-list': function(e,tmpl){		
		//Meteor.http.get("GET", "http://www.51bi.com/search/?keyword=" + e.target.value, followRedirects=true);
		Router.goSearch("http://www.51bi.com/search/?keyword=" + tmpl.find("#wish-item-input").value);
	},
	'click #cancel-button': function(e){
		Session.set('editing_itemname', null);
	},
	'click #delete-button': function(e){
		WishList.remove(this._id);
	},
	'click #save-button': function(e, tmpl){
		var text = getValue(tmpl, "#wish-item-input");
		var price = getValue(tmpl, "#wish-item-price");
		var quantity = getValue(tmpl, "#wish-item-quantity");
		var received_quantity = getValue(tmpl, "#wish-item-received");
		var created_date = getValue(tmpl, "#wish-item-created-date");
		updateWish(text, price, quantity, received_quantity, created_date, this._id);
		Session.set('editing_itemname', null);
	}
	/*,
	'focusout #wish-item-input': function(e,t){
		console.log(e.target);
		Session.set('editing_itemname', null);
	}*/
	//'click': function(e, tmpl){
	//	console.log(e.target.id);
	//	if(e.target.id !== "#wish-item-input" && e.target.id !== "#search-button" ){
	//		Session.set('editing_itemname', null);
	//	}
	//}
});

var activateInput = function (input) {
  input.focus();
  input.select();
};

var getValue = function(tmpl, element_id){
	var element = tmpl.find(element_id);
	return tmpl.find(element_id).value;
};

function addNewWish(text, price){
    Meteor.call('createWishItem', {
        productDesc: text,
        price: price
    });
};

function updateWish(text, price, quantity, quantity_received, created_date, id){
	WishList.update(id, {$set: {text: text, price: price, quantity: quantity, quantity_received: quantity_received, created_date: created_date}});
};

var ClientRouter = Backbone.Router.extend({
  goSearch: function (url) {
    //this.navigate(url);
	console.log(url);
	window.open(url);
	
  }
});

Handlebars.registerHelper("dateFormat", function(context, block) {
  if (window.moment && ("" !== context && context !== null)) {
    //console.log("Moment Exist and load sucessfully");
    var f = block.hash.format || "MMM Do, YYYY";
//    console.log("Date will be formated to -> " + f);
    return moment(context).format(f);
  }else{
      //console.log("Moment Exist and load failed or date is null");
    return context;   //  moment plugin not available. return data as is.
  }
});

Router = new ClientRouter;

Meteor.startup(function () {
  //Backbone.history.start({pushState: true});
});
/*
document.onclick=function() 
    { 
        var elements=window.event?document.all:document.target; 
        for(var i=0;i <elements.length;i++) 
        { 
            if(elements[i].type=="button") 
              { 
                alert(elements[i].id); 
            } 
        }  
    } 
	*/