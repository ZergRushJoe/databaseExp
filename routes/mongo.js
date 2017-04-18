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

    item_collection.find({$where: "this.item_name !== 'secret'"}).toArray(function(err,rows)
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
        if (req.query.name === "secret"){
            throw error;
        }
        let q_string = "this.item_name === '"+req.query.name+"'";
        item_collection.find({$where: q_string}).toArray(function(err, rows){
            console.log(rows);
            res.send(JSON.stringify({complete:true,items:rows}))
        });
        /*item_collection.find({$where: function(){
            if (this.item_name === $req.query.name){
                return true;
            }
        }}).toArray(function(err, rows){
            console.log(rows);
            res.send(JSON.stringify({complete:true,items:rows}))
        });*/
        //non-vulnerable search below
        /*item_collection.find({item_name: new RegExp(q_name, 'i')}).toArray(function(err, rows){
         console.log(rows);
         res.send(JSON.stringify({complete:true,items:rows}))
         });*/

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
//adding login functionality
router.get("/log", function(req, res, next)
{
    res.render('login');
});

router.get('/login/',function(req,res,next)
{
    try
    {
        console.log("in /login");
        let user_collection = db.collection("users");
        username = req.query.username;
        password = req.query.password;
        console.log('username', username, 'password', password);

        let q_string = "this.username === '"+req.query.username+"'" + "&& this.password === '"+req.query.password+"'";
        user_collection.find({$where: q_string}).toArray(function(err, rows){
            if(rows.length>0) {
                console.log('found:', rows);
                res.send(JSON.stringify({complete:true,items:"success!"}));
                console.log('success');
            }
            else{
                res.send(JSON.stringify({complete:true,items:"failure!"}));
                console.log('failure');
            }
        });
    }catch(e)
    {
        res.send(JSON.stringify({complete:false,err:e}));
    }

    let q_string = "this.username === '' || 1==1 || && this.password === ''";
    user_collection.find({$where: "this.username === '' || 1==1 || && this.password === ''"}).toArray(function(err, rows)
});

module.exports = router;
