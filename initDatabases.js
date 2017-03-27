/**
 * Created by joe12 on 3/21/2017.
 */
const sqlite = require('sqlite3').verbose();
const mongo = require('mongodb');

let sqldb = new sqlite.Database(
    'databases/sqlite.db',
    'OPEN_READWRITE | OPEN_CREATE',
    function(err)
    {
        if(err)
        {
            console.log(err)
        }
    });
let mongodb = mongo.Db('mongo',new mongo.Server('localhost',8000),{w:1});
mongodb.open(function(err, p_db)
{
    if(err)
    {
        console.log(err)
    }
    p_db.close();
});