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
    db.run("INSERT INTO ITEMS VALUES (?,?,?)",[req.body.name,req.body.ID,req.body.quantity],(function(err)  {
        if(err) {
            console.log(err);
            next(500);
            return;
        }
        res.redirect('/');
    }));

});
module.exports = router;
