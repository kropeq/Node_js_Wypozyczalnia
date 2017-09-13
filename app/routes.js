var express = require('express');
var router = express.Router();
var Cars = require('./models/cars');
var Users = require('./models/users');

router.get('/', function(req,res){
	console.log('Przywilej sesji START: '+req.session.privi);
	res.render('template.ejs', {
		nickname: req.session.nick,
		priviliges: req.session.privi
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

router.get('/profile',function(req,res){
	Users.findOne({"nickname":req.session.nick},function(err, user){
		if(!err){
			if(user==null){
				console.log('Nie znaleziono profilu tego użytkownika.');
			} else {
				res.render('profile.ejs',{ user: user });
			}
		} else console.log('Error w profilu: '+err);
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
	req.session.priviliges = undefined;
	res.render('logout.ejs');
});

router.post('/login', function(req,res){
	var login = req.body.nick;
	var pass = req.body.pass;
	Users.findOne({"nickname":req.body.nick, "password":req.body.pass},function(err,user){
		if(!err){
			if (user!=null){
				req.session.nick = login;
				req.session.pass = pass;
				req.session.privi = user.priviliges;
				console.log('Zalogowano na konto: '+login+' jako '+user.priviliges);
				res.send({response: 'logged',priviliges: user.priviliges}); // bez response nie zapamiętuje sesji
			} else {
				res.send({response: 'wrong pass', priviliges: ""});
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
			req.session.nick = login;
			req.session.pass = pass;
			res.send('registered');	// bez response nie zapamiętuje sesji
		} else {
			if(err.code==11000){
				console.log("Proba dodania usera '"+login+"', ktory juz istnieje... ");
				res.send('occupied');
			} else {
				console.log("Cos poszlo nie tak z nowym userem... "+err);
			}
			
		}
	});
});

router.post('/profile', function(req,res){
	var login = req.session.nick;
	var pass = req.body.pass;
	var name = req.body.name;
	var surname = req.body.surname;
	var country = req.body.country;
	var phone = req.body.phone;
	var email = req.body.email;

	// sprawdzamy czy jest w bazie przed edycja
	Users.findOne({"nickname":req.session.nick},function(err,result){
		if(!err){
			if(result != null){
				Users.update(
					{ nickname: req.session.nick }, 
					{ $set: { password: pass, name: name, surname: surname,
							  country: country, phone: phone, email: email }
					},function(err,raw){
						if(err) console.log('Update: '+err);
						console.log("Update raw: "+raw);
					}
				);
				console.log('Niby zrobilem update'+req.session.nick);
			} else console.log('Nie znaleziono profilu tego uzytkownika...');
		} else console.log('Blad podczas edycji profilu: '+err);
	});
	req.session.nick = login;
	req.session.pass = pass;
	res.send('logged');	// bez response nie zapamiętuje sesji
});


module.exports = router;