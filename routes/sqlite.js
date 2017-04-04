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
    db.all('select name,id,quantity from items;',function(err,rows)
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

module.exports = router;
