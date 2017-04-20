const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const cleaner = require('string_cleaner');
let logged = false;

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

    item_collection.find({$where: "this.item_key !== 'private'"}).toArray(function(err,rows)
    {
        console.log(rows);
        res.render('items', {items: rows, path:"./search"})
    });
});
//adding search functionality - Kalie
router.get('/search',function(req,res,next)
{
    try
    {
        let item_collection = db.collection("items");
        if (req.query.name === "secret"){
            throw error;
        }
        let q_string = "(this.item_key === 'public' && this.item_name === '"+req.query.name+"')";
        item_collection.find({$where: q_string}).toArray(function(err, rows){
            console.log('successful');
            //console.log(rows);
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
    if(!logged){
        console.log("you must be logged in to insert an item");
        return;
    }
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

router.get("/log", function(req, res, next)
{
    res.render('login',{path:"./login"});
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
                res.send(JSON.stringify({complete:true, items:"success!", disp_username:username}));
                console.log('success');
                logged = true;
            }
            else{
                res.send(JSON.stringify({complete:true,items:"failure!", disp_username:null}));
                console.log('failure');
                logged = false;
            }
        });
    }catch(e)
    {
        res.send(JSON.stringify({complete:false,err:e}));
    }
});
//safe search
router.get("/log-safe", function(req, res, next)
{
    res.render('login',{path:"./login-safe"});
});

router.get('/login-safe/',function(req,res,next)
{
    try
    {
        let user_collection = db.collection("users");
        username = ""+req.query.username+"";
        username = username.replace(/[=|&{}"'/]/g,'');
        console.log('replace fn: ', username.replace(/[=|&{}"'/]/g,''));
        password = ""+req.query.password+"";
        password = password.replace(/[=|&{}"'/]/g,'');
        console.log('username', username, 'password', password);

        let q_string = "this.username === '"+username+"' && this.password === '"+password+"'";
        user_collection.find({$where: q_string}).toArray(function(err, rows){
            if(rows.length>0) {
                console.log('found:', rows);
                res.send(JSON.stringify({complete:true, items:"success!", disp_username:username}));
                console.log('success');
                logged = true;
            }
            else{
                res.send(JSON.stringify({complete:true,items:"failure!", disp_username:null}));
                console.log('failure');
                logged = false;
            }
        });
    }catch(e)
    {
        res.send(JSON.stringify({complete:false,err:e}));
    }
});
//adding safe search functionality - Kalie
router.get('/search-safe',function(req,res,next)
{
    try
    {
        q_name = re.query.name.replace(/[=|&{}"'/]/g,'');
        console.log(q_name);
        let item_collection = db.collection("items");
        let q_string = "(this.item_key === 'public' && this.item_name === '"+qname+"')";
        item_collection.find({$where: q_string}).toArray(function(err, rows){
            console.log(rows);
            res.send(JSON.stringify({complete:true,items:rows}))
        });

    }catch(e)
    {
        res.send(JSON.stringify({complete:false,err:e}));
    }
});

router.get("/items-safe", function(req, res, next)
{
    console.log(db.collection("items"));
    let item_collection = db.collection("items");

    item_collection.find({$where: "this.item_key !== 'private'"}).toArray(function(err,rows)
    {
        console.log(rows);
        res.render('items', {items: rows, path:"./search-safe"})
    });
});

module.exports = router;
