var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/anketa/:id', login, function(req, res, next) {
  res.render('anketa', { id: req.params.id });
});

router.get('/', login, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function login(req, res, next){
  if(!req.session['user'])
    return res.render('userLogin', { name:''});
  req.session['user']=true;
  next();
}
router.post('/userLogin', function(req, res, next) {
  if(req.body.name=='user' && req.body.pass=='Bolero123')
  {
    req.session['user']=true;
   return  res.redirect("/");
  }
  res.render('userLogin', { name: req.body.name });
});


router.get('/admin', adminLogin, function(req, res, next) {
  res.render('admin', { title: 'Express' });
});

router.get('/itemCard', function(req, res, next) {
  res.render('elements/itemCard.pug', );
});
router.get('/anketaCard', function(req, res, next) {
  res.render('elements/anketaCard.pug', );
});
router.post('/adminLogin', function(req, res, next) {
  if(req.body.name=='admin' && req.body.pass=='Bolero123')
  {
    req.session['admin']=true;
    return res.redirect("/admin");
  }
  res.render('adminLogin', { name: req.body.name });
});


function adminLogin(req, res, next){
  if(!req.session['admin'])
    return res.render('adminLogin', { name:''});

  req.session['admin']=true;
  next();
}

module.exports = router;
