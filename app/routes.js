var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cars = require('./models/cars');
var Users = require('./models/users');
var Awaiting = require('./models/awaiting');

router.get('/', function(req,res){
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

router.get('/priviliges',function(req,res){
	Users.find({},function(err,users){
		if(err) console.log('Blad zakladki przywileje: '+err);
		else if(users!=null) res.render('priviliges.ejs',{users: users});
		else console.log('Nie znaleziono uzytkownikow do przywileji');
	});
});

router.get('/ad',function(req,res){
	if(req.session.nick==undefined){
		res.redirect('/main');
	} else {
		res.render('ad.ejs');
	}
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
						if(err) console.log('Update profile: '+err);
						else {
							res.send('updated');
							req.session.pass = pass;
							console.log("Update profile raw: "+raw);
						}
					}
				);
				console.log('Zrobilem update profilu: '+req.session.nick);
			} else console.log('Nie znaleziono profilu tego uzytkownika...');
		} else console.log('Blad podczas edycji profilu: '+err);
	});
});

router.post('/priviliges/:id',function(req,res){
	var nickname = req.body.nickname;
	var id = req.params.id;
	id = id.substr(1); // usuwam ":" sprzed parametru id
	var objectid = mongoose.Types.ObjectId(id);
	var newPriviliges = req.body.newPriviliges;
	// sprawdzamy czy jest w bazie przed edycja
	Users.findOne({ _id : objectid } ,function(err,result){
		if(!err){
			if(result != null){
				Users.update(
					{ _id : objectid }, 
					{ $set: { priviliges: newPriviliges }
					},function(err,raw){
						if(err) console.log('Update priviliges: '+err);
						else {
							res.send('updated');
							console.log("Update priviliges raw: "+raw);
						}
					}
				);
				console.log('Zrobilem update przywilejow: '+nickname);
			} else console.log('Nie znaleziono id tego uzytkownika by zmienic przywileje...');
		} else console.log('Blad podczas edycji przywilejow: '+err);
	});
});

router.post('/proposal',function(req,res){
	var awaiting = new Awaiting({
		brand: req.body.brand,
		model: req.body.model,
		version: req.body.version,
		year: req.body.year,
		capacity: req.body.capacity,
		power: req.body.power,
		fuel: req.body.fuel,
		gearbox: req.body.gearbox,
		drive: req.body.drive,
		type: req.body.type,
		doors: req.body.doors,
		seats: req.body.seats,
		wheel: req.body.wheel,
		vat: req.body.vat,
		place: req.body.place
	});
	awaiting.save(function(err){
		if(!err) {
			console.log('Dodana nowa propozycja ogloszenia. ');
			res.send('added');
		} else console.log('Blad zapisu nowej propozycji ogloszeni: '+err);
	});
});

module.exports = router;