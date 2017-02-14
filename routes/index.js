var express = require('express');
var router = express.Router();
var sql = require('../lib/sql.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/login',function(req, res, next){

  const username = req.body.username;
  const password = req.body.password;

  sql.login(username,password,function(error,result){
    if(error){
      console.log("Error Login:",error)
      return res.redirect('/');
    }

    if(result.length===0){
      return res.redirect('/');
    }

    console.log(" User session :",result[0]);

    req.session.user = result[0];

    return res.redirect('/users');
  })
})
module.exports = router;
