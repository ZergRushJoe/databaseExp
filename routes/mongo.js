const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
/** here we have the function that will pass the object to the database from an array that we pull*/
let MongoClient = require('mongodb').MongoClient;
let db;

MongoClient.connect('mongodb://127.0.0.1:27017/secProj', function(err, db_temp)
{
    if (err)
    {
        console.log(err);
        return;
    }
    db =db_temp;
});
/** Pavan and mikey have the data display on the webpage here. */
router.get("/items", function(req, res, next)
{
    console.log(db.collection("items"));
    let item_collection=db.collection("items");

    item_collection.find().toArray(function(err,rows)
    {
        console.log(rows);
        res.render('items', {items: rows})
    });

});


module.exports = router;/**
 * Created by Pavan on 4/4/2017.
 */
