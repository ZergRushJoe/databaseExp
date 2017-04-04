/**
 * Created by Kales on 4/4/2017.
 */

const mongo = require("mongodb");
const sqlite = require("sqlite3");
const fs = require('fs');
const util = require('util');

let sqldb = new sqlite.Database('databases/sqlite.db', function (err, sqldb) {
    if (err) {
        console.log(err);
        return;
    }
});
sqldb.run('CREATE TABLE USER(ID INTEGER PRIMARY KEY AUTOINCREMENT, USERNAME CHAR(20), PASSWORD CHAR(20));', function (err) {
    if (err) {
        console.log(err);
        return;
    }
});
sqldb.run('CREATE TABLE ITEM(ITEM_ID INTEGER PRIMARY KEY, ITEM_NAME CHAR(20), QUANTITY INTEGER);', function (err) {
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
    MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1:27017/secProj', function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        let user_collection = db.collection("users");
        let item_collection = db.collection("items");
        //let user;
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
        let j = -1;

        db.close();
    });

    for (user in user_pw_dictionary) {
        password = user_pw_dictionary[user];
        command = util.format('INSERT into USER(username, password) VALUES("%s", "%s")', user, password);
        sqldb.run(command, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('user entry created.');
        });
    }
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
        if(content[0]!='') {
            item_dictionary[content[0]] = content.slice(1, content.length);
        }
    }
    MongoClient = require('mongodb').MongoClient;
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
                quantity:item_dictionary[item][1]
            }, function (err, prom) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }

        db.close();
    });

    for (item in item_dictionary) {
        item_name = item_dictionary[item][0];
        quantity = item_dictionary[item][1];
        command = util.format('INSERT into ITEM(item_id, item_name, quantity) VALUES(%s, "%s", %s)', item, item_name, quantity);
        sqldb.run(command, function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
});