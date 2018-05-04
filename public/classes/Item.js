
"use strict";
var itembas = require('../../Model/itembas');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

class Item {
    constructor(item_id, type, price, description, no_stock)
    {
      this.item_id = item_id;
      this.price = price;
      this.type = type;
      this.description = description;
      this.no_stock = no_stock;

    }

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


    deleteItem(keyword){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var myquery = { address: 'keyword' };
            dbo.collection("itembas").deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
            });
        });
    }
}

module.exports = Item;
