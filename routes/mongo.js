const express = require('express');
const router = express.Router();
const mongo = require('mongodb');

let MongoClient = require('mongodb').MongoClient;
let db;

MongoClient.connect('mongodb://127.0.0.1:27017/secProj', function(err, db_temp)
{
    if (err)
    {
        console.log(err);
        return;
    }
    db = db_temp;
});

/** Pavan and Mikey have the data display on the web page. */

router.get("/items", function(req, res, next)
{
    console.log(db.collection("items"));
    let item_collection = db.collection("items");

    item_collection.find().toArray(function(err,rows)
    {
        console.log(rows);
        res.render('items', {items: rows})
    });
});
//adding search functionality - Kalie
router.get('/search',function(req,res,next)
{
    try
    {
        let item_collection = db.collection("items");
        console.log("here's yours search field:");
        console.log(req.query.name);
        q_name='\.*'+req.query.name+'\.';
        item_collection.find({item_name: new RegExp(q_name, 'i')}).toArray(function(err, rows){
            console.log(rows);
            //res.render('items', {items: rows});
            res.send(JSON.stringify({complete:true,items:rows}))
        });
    }catch(e)
    {
        res.send(JSON.stringify({complete:false,err:e}));
    }
});

router.get("/insert",function(req,res,next)
{
    res.render('forms');
});

/** Created by Mikey on 4/13/17 */
router.post("/insert", function(req, res, next)
{
    let item = {
        name: req.body.name,
        quantity: req.body.quantity
    };
    db.collection("items").insertOne(item, function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Item inserted");
        }
    });
});

module.exports = router;
