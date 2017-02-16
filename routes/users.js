var express = require('express');
var router = express.Router();
var sql = require('../lib/sql.js');
var sanitizeHtml = require('sanitize-html');

/* GET users listing. */
router.get('/',function(req,res,next){

  const cityId = req.session.user.cityId;
  const city = req.session.user.city;

  sql.listEvents({ cityId },function(error,events){
    if(error){
      return res.render('index',{ events:[], city });
    }
    return res.render('index',{ events, city });
  })
});

router.post('/search',function(req,res,next){

  const query = req.body['query'];
  const userSession = req.session.user;
  const cityId = userSession.cityId;

  sql.listEventsBy({ query, cityId },function(error,events){
    if(error){
      console.log(" Error :",error)
      return res.json({ events:[] });
    }
    return res.json({ events });
  })
})

router.get('/logout',function(req,res,next){
  req.session.destroy(function(err) {
    if(err) {
      return res.redirect('/');
    } else {
      return res.redirect('/');
    }
  });
})

router.get('/:eventId',function(req,res,next){

  const eventId = req.params.eventId;
  const userSession = req.session.user;

  sql.getEventById(eventId,function(error,events){
    if(error){
      return res.redirect('/users');
    }
    let event = events[0];
    return res.render('event',{ event });
  })
})

router.get('/coment/:eventId',function(req,res,next){

  const eventId = req.params.eventId;
  const userSession = req.session.user;

  sql.getCommnetariesByEvent(eventId,function(error,comments){
    if(error){
      return res.json({ comments:[] });
    }

    console.log("Eventos :",comments)
    return res.json({ comments });
  })

})

router.post('/comment',function(req,res,next){


  const eventId = req.body.eventId;
  const userId  = req.session.user.id;
  const commentary = sanitizeHtml(req.body.commentary);

  if(commentary.trim().length==0){
    return res.json({ code:'ok', message: 'Request Successfully'});
  }

  sql.saveComment({ commentary, userId, eventId },function(error,result){
    if(error){
      console.log("Error :",error);
      return res.status(400).json({ message:'Server Error, Something happend '});
    }
    return res.json({ code:'ok', message: 'Request Successfully'});
  })
})

module.exports = router;
