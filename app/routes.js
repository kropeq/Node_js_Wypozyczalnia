var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
	res.render('template.ejs', {
		nick: req.session.nick
	});
});

router.get('/main', function(req,res){
	res.render('main.ejs',{nickname: req.session.nick });
});

router.get('/main/auta', function(req,res){
	res.render('main/auta.ejs',{nickname: req.session.nick });
});

router.get('/main/samoloty', function(req,res){
	res.render('main/samoloty.ejs',{nickname: req.session.nick });
});

router.get('/login', function(req,res){
	res.render('login.ejs');
});

router.get('/logout', function(req,res){
	req.session.nick = undefined;
	req.session.pass = undefined;
	res.render('logout.ejs');
});

router.post('/login', function(req,res){
	var login = req.body.nick;
	var pass = req.body.pass;
	req.session.nick = login;
	req.session.pass = pass;
	res.send('logged');	// bez response nie zapamiętuje sesji
	//console.log("Nickname: "+login+" Hasło: "+pass);
});

module.exports = router;