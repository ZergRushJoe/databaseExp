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

let MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/secProj', function(err, db)
{
    if (err)
    {
        console.log(err);
        return;
    }
    else
    {
        let collection = db.collection('documents');
        collection.insertMany([{'Kalie':'Humbarger'}, {'Joe':'Karp'}, {'Mikey':'Ho'}, {'Pavan':'Policherla'}, {'Justin':'Stryjewski'}], function(err, result)
        {
            if (err)
            {
                console.log(err);
            }
        });
        console.log("Inserted Documents");
        db.close();
    }
});
