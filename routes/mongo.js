const express = require('express');
const router = express.Router();
/** here we have the function that will pass the object to the database from an array that we pull*/
router.get("/items", function(req, res, next)
{
    res.render('items',{items:
    [



    ]
    });
    res.send("hello");

});


module.exports = router;/**
 * Created by Pavan on 4/4/2017.
 */
