var express = require('express');
var router = express.Router();
var Cars = require('./models/cars');
var Users = require('./models/users');

router.get('/', function(req,res){
	res.render('template.ejs', {
		nick: req.session.nick
	});
});

router.get('/main', function(req,res){
	res.render('main.ejs',{nickname: req.session.nick });
});

router.get('/cars', function(req,res){
	 Cars.find().sort({"brand": 1}).exec(function(err, cars){
		if(!err){
			res.render('cars/cars.ejs',{nickname: req.session.nick, cars: cars });
		} else {
			res.send('Error: '+err);
		};
	});
});

router.get('/cars/description', function(req,res){
	res.render('cars/description.ejs',{nickname: req.session.nick });
});

router.get('/login', function(req,res){
	res.render('login.ejs');
});

router.get('/logout', function(req,res){
	console.log('Wylogowano z konta: ' + req.session.nick);
	req.session.nick = undefined;
	req.session.pass = undefined;
	res.render('logout.ejs');
});

router.post('/login', function(req,res){
	var login = req.body.nick;
	var pass = req.body.pass;
	Users.findOne({"nickname":req.body.nick, "password":req.body.pass},function(err,result){
		if(!err){
			if (result!=null){
				req.session.nick = login;
				req.session.pass = pass;
				console.log('Zalogowano na konto: '+login);
				//res.send('logged');	// bez response nie zapamiętuje sesji
				res.redirect('/');
			} else {
				console.log('Nie znaleziono pasujacych danych logowania w bazie...');
			}
		} else {
			console.log('Blad podczas logowania: '+err);
		}
	});
});

router.post('/register', function(req,res){
	var login = req.body.nick;
	var pass = req.body.pass;
	var name = req.body.name;
	var surname = req.body.surname;
	var country = req.body.country;
	var phone = req.body.phone;
	var email = req.body.email;

	var newUser = new Users({
		nickname: login,
		password: pass,
		name: name,
		surname: surname,
		country: country,
		phone: phone,
		email: email,
		priviliges: "user"
	});
	newUser.save(function(err){
		if(!err) {
			console.log("Zapisalem nowego uzytkownika: "+login+"...");
		} else {
			console.log("Cos poszlo nie tak z nowym userem... ");
		}
	});
	req.session.nick = login;
	req.session.pass = pass;
	res.send('logged');	// bez response nie zapamiętuje sesji
});


module.exports = router;