
"use strict";

//DATABASE HANDLERS AND INTERFACES REQUIRED FOR ACCESSING THE THIRD LAYER
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var itembas = require('../../Model/itembas');

//ITEM CLASS ENCAPSULATES INFORMATION RELATED TO AN ITEM IN AN INVENTORY MAINTAINED BY A SUPPLIER
class Item {
    constructor(item_id, type, price, description, no_stock)
    {
      this.item_id = item_id;
      this.price = price;
      this.type = type;
      this.description = description;
      this.no_stock = no_stock;
    }

    //ADD ITEM METHOD ADDS AN ITEM TO THE INVENTORY OF THE USER WHO INVOKES THIS METHOD USING MONGOOSE-MONGODB HANDLER
    addItem()
    {
        var newItem = new itembas({

            Owner:this.item_id,
            Type:this.type,
            Price: this.price,
            Description:this.description,
            Stock: this.no_stock
        });

        itembas.addItem(newItem, function(error, user){
            if(error)throw error;
            console.log(user);
        });
    }

    //DELETE ITEM DELETES AN ITEM FROM THE INVENTORY OF THE USER WHO INVOKES THIS METHOD USING MOONGOOSE-MONGODB HANDLER
    deleteItem(type, user){

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            var myquery = { Type:type, Owner:user};
            dbo.collection("itembas").deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                db.close();
            });
        });
    }

    //THIS METHOD ALLOWS THE USER TO VIEW THEIR OWN ENTIRE INVENTORY
    findItem(user, callback){

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            var query = {Owner: user };
            dbo.collection("itembas").find(query).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                return callback(result);
            });
        });
    }

    //THIS METHOD ALLOWS THE USER TO VIEW ALL THE ITEMS AVAILABLE IN THE DATABASE MADE BY ANY USER
    viewItems(callback)
    {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            dbo.collection("itembas").find().toArray(function(err, result) {
                if (err) throw err;
                db.close();
                return callback(result);
            });
        });
    }

}

module.exports = Item;
