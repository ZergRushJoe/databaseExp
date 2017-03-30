const express = require('express');
const router = express.Router();

//creates a dummy page of how it items view should look when done
router.get('/itemsBlank',function(req,res,next)
{
    res.render('items', { items:
        [
            {name:"apple",id:1,quantity:10},
            {name:"baseball bat",id:2,quantity:2},
            {name:"things",id:3,quantity:4},
            {name:"something else",id:5,quantity:9001}
        ] });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { name: 'joe' });
});

module.exports = router;
