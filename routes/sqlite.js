/**
 * Created by jerry on 4/3/2017.
 */
const express = require('express');
const router = express.Router();
const sqlite = require('sqlite3').verbose();

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
        res.render('items', { items:rows});

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
    res.render('login');
});

router.get('/login/',function(req,res,next)
{
    try
    {
        console.log("in /login");
        db.get("select PASSWORD as pass from USER where USERNAME ='"+req.query.username+"';",function(err,row)
        {
           if(err)
           {
               res.send(JSON.stringify({complete:false,err:err}));
           }
           if(row.pass && row.pass == req.query.password)
           {
               res.send(JSON.stringify({complete:true,items:"Success!"}));
           }
           else
           {
               res.send(JSON.stringify({complete:false,err:"not correct password"}));
           }



        });
    }catch(e)
    {
        console.log(JSON.stringify(e));
        res.send(JSON.stringify({complete:false,err:e}));
    }
});

module.exports = router;
