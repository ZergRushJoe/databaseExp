/**
 * Created by Kales on 4/17/2017.
 */
const sqlite = require('sqlite3').verbose();
const mongo = require('mongodb');
MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const util = require('util');

MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
    if (err) {
        console.log(err);
        return;
    }
    let adminDb = db.admin();
    let flag = adminDb.listDatabases().then(function (dbs) {
        let flag = false;
        let dFlag = false;
        while(flag == false) {
            console.log(dbs.databases);
            for (element in dbs.databases) {
                if (dbs.databases[element]['name'] === 'secProj') {
                    console.log('found item');
                    if(dFlag !== true)
                    {
                        dFlag = true;
                        MongoClient.connect('mongodb://127.0.0.1:27017/secProj', function (err, db2) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log('connected to db');
                            db2.dropDatabase(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('deleted db');
                            });
                            return;
                        });
                    }
                }
                else {
                    flag = true;
                }
            }
        }
        db.close();
    });
});


let sqldb = new sqlite.Database(
    'databases/sqlite.db',
    function (err) {
        if (err) {
            console.log(err)
        }
    });

sqldb.run('CREATE TABLE IF NOT EXISTS USER(USERNAME CHAR(20) PRIMARY KEY, PASSWORD CHAR(20));', function (err) {
    if (err) {
        console.log(err);
        return;
    }
});
sqldb.run('CREATE TABLE IF NOT EXISTS ITEM(ITEM_ID INTEGER PRIMARY KEY, ITEM_NAME CHAR(20), QUANTITY INTEGER);', function (err) {
    if (err) {
        console.log(err);
        return;
    }
});

fs.readFile('data.txt', 'utf8', function (err, fdata) {
    if (err) {
        console.log(err);
        return;
    }
    user_pw_dictionary = {};
    //pull in data from file
    let data = fdata;
    data = data.split('user');
    let user;
    for (user in data) {
        let cleanstr = data[user].replace(/[\r\n]/g, '');
        let content = cleanstr.split('\t');
        user_pw_dictionary[content[0].replace(' ', '')] = content[1];
    }

    for (user in user_pw_dictionary) {
        password = user_pw_dictionary[user];
        command = util.format('INSERT or IGNORE into USER(username, password) VALUES("%s", "%s")', user, password);
        sqldb.run(command, function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
    }

    MongoClient.connect('mongodb://127.0.0.1:27017/secProj', function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        let user_collection = db.collection("users");
        let i = -1;
        for (user in user_pw_dictionary) {
            i++;
            user_collection.insertOne({
                _id: i,
                username: user,
                password: user_pw_dictionary[user]
            }, function (err, prom) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
        db.close();
    });
    return;
});

fs.readFile('data2.txt', 'utf8', function (err, fdata) {
    if (err) {
        console.log(err);
        return;
    }
    item_dictionary = {};
    //pull in data from file
    let data = fdata;
    data = data.split('\r\n');
    let item;
    for (item in data) {
        let content = data[item].split('    ');
        if (content[0] != '') {
            item_dictionary[content[0]] = content.slice(1, content.length);
        }
    }

    for (item in item_dictionary) {
        item_name = item_dictionary[item][0];
        quantity = item_dictionary[item][1];
        command = util.format('INSERT or IGNORE into ITEM(item_id, item_name, quantity) VALUES(%s, "%s", %s)', item, item_name, quantity);
        sqldb.run(command, function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
    }

    MongoClient.connect('mongodb://127.0.0.1:27017/secProj', function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        let item_collection = db.collection("items");
        let i = -1;
        for (item in item_dictionary) {
            i++;
            item_collection.insertOne({
                _id: i,
                item_id: item,
                item_name: item_dictionary[item][0],
                quantity: item_dictionary[item][1]
            }, function (err, prom) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }

        db.close();
    });
});
