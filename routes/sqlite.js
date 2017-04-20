/**
 * Created by jerry on 4/3/2017.
 */
const express = require('express');
const router = express.Router();
const sqlite = require('sqlite3').verbose();
const cleaner = require('string_cleaner');

let db = new sqlite.Database('../databases/sqlite.db',sqlite.OPEN_READWRITE,function(err)
{
    if(err)
    {
        console.log(err);
    }
});

router.get('/items',function(req,res,next)
{
    db.all('select item_name as name,item_id as id,QUANTITY as quantity from item;',function(err,rows)
    {

        if(err)
        {
            console.log(err);
            next(500);
            return;
        }
        res.render('items', { items:rows,path:"./search"});

    });

});

router.get('/items-safe',function(req,res,next)
{
    db.all('select item_name as name,item_id as id,QUANTITY as quantity from item;',function(err,rows)
    {
        if(err)
        {
            console.log(err);
            next(500);
            return;
        }
        res.render('items', { items:rows, path:"./search-safe" });

    });

});



router.get('/search',function(req,res,next)
{
   try
   {
       console.log(req.query.name);
       db.all("select item_name as name,item_id as id,QUANTITY as quantity from item where item_name LIKE '%"+req.query.name+"%';",
       function(err,rows)
       {
           console.log("not safe");
           if(err)
           {
               res.send(JSON.stringify({complete:false,err:err}));
           }
           console.log(rows);
           res.send(JSON.stringify({complete:true,items:rows}))
       });
   }catch(e)
   {
       res.send(JSON.stringify({complete:false,err:e}))
   }
});

router.get('/search-safe',function(req,res,next)
{
    try
    {
        let temp = cleaner.sqlClean(req.query.name+"");
        console.log(temp);
        db.all("select item_name as name,item_id as id,QUANTITY as quantity from item where item_name LIKE '%"+temp+"%';",
            function(err,rows)
            {
                if(err)
                {
                    res.send(JSON.stringify({complete:false,err:err}));
                }
                console.log(rows);
                res.send(JSON.stringify({complete:true,items:rows}))
            });
    }catch(e)
    {
        res.send(JSON.stringify({complete:false,err:e}))
    }
});

router.get('/Insert',function(req,res)
{
    res.render('forms')
});
router.post('/Insert',function(req,res,next)
{
    console.log(req.body);
    db.run("INSERT INTO ITEM VALUES (NULL,?,?)",[req.body.name,parseInt(req.body.quantity)],(function(err)  {
        if(err) {
            console.log(err);
            next(500);
            return;
        }
        res.send(JSON.stringify({complete:true}));
    }));

});

router.get("/log", function(req, res, next)
{
    res.render('login',{path:"./login"});
});
router.get("/log-safe", function(req, res, next)
{
    res.render('login',{path:"./login-safe"});
});
router.get('/login/',function(req,res,next)
{
    try
    {
        console.log("in /login");
        db.get("select PASSWORD as pass, USERNAME as user from USER where USERNAME ='"+req.query.username+"' AND PASSWORD='"+req.query.password+"';",function(err,row)
        {
            console.log(row);
            if(err)
            {
                res.send(JSON.stringify({complete:false,err:err}));
            }
            if(row===undefined){
                res.send(JSON.stringify({complete:true,items:"Failure!", disp_username:"Stranger"}));
            }
            //else if(row.pass && row.pass == req.query.password)
            else
            {
                res.send(JSON.stringify({complete:true,items:"Success!", disp_username:row.user}));
            }
            /*else
            {
                res.send(JSON.stringify({complete:false,err:"not correct password"}));
            }*/



        });
    }catch(e)
    {
        console.log(JSON.stringify(e));
        res.send(JSON.stringify({complete: false, err: e}));
    }
});


router.get('/login-safe/',function(req,res,next)
{
    try
    {
        console.log("in /login");
        username = req.query.username.replace(/[;'-]/g,'');
        password = req.query.password.replace(/[;'-]/g,'');
        db.get("select PASSWORD as pass, USERNAME as user from USER where USERNAME ='"+username+"' AND PASSWORD='"+password+"';",function(err,row)
        {
            console.log(row);
            if(err)
            {
                res.send(JSON.stringify({complete:false,err:err}));
            }
            if(row===undefined){
                res.send(JSON.stringify({complete:true,items:"Failure!", disp_username:"Stranger"}));
            }
            //else if(row.pass && row.pass == req.query.password)
            else
            {
                res.send(JSON.stringify({complete:true,items:"Success!", disp_username:row.user}));
            }
        });
    }catch(e)
    {
        console.log(JSON.stringify(e));
        res.send(JSON.stringify({complete: false, err: e}));
    }
});

module.exports = router;

