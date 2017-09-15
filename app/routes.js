var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// wykorzystam do stworzenia folderu jesli nie istnieje
var fs = require('fs');
// wykorzystuje do uploadu wielu zdjec rownoczesnie
var multer = require('multer');
// okreslenie punktu docelowego przechowywania oraz nazewnictwa dla multer
var storage = multer.diskStorage({
	// pobranie obecnej daty, by rozrozniac zdjecia o tej samej nazwie
	destination: function(req,file,cb){	
		var brand = req.body.brand.replace(/ /g,'_');
		var model = req.body.model.replace(/ /g,'_');

		// wpierw trzeba stworzyc folder nadrzedny, a pozniej podfolder
		var dir1 = 'public/images/adverts/'+req.session.nick;
		var dir2 = dir1 +'/'+req.body.date+ '_' + brand+'_'+model;

		// jesli nie ma folderu - stworz go
		if(!fs.existsSync(dir1)) fs.mkdirSync(dir1);
		if(!fs.existsSync(dir2)) fs.mkdirSync(dir2);

		// ustalenie folderu docelowego uploadowanych zdjec
		cb(null,dir2+'/')
	},
	filename: function(req,file,cb){
		cb(null,req.body.date + "_" + file.originalname)
	}
});
// zdefiniowanie sposobu przechowywania
var upload = multer({ storage: storage });
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
			res.render('cars/cars.ejs',{nickname: req.session.nick, priviliges: req.session.privi, cars: cars });
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
		res.render('ad.ejs',{nickname: req.session.nick});
	}
});

router.get('/awaiting',function(req,res){
	if(req.session.nick==undefined){
		res.redirect('/main');
	} else {
		Awaiting.find({},function(err,awaiting){
			if(err) console.log('Blad zakladki oczekujace: '+err);
			else if(awaiting!=null) res.render('awaiting.ejs',{adverts: awaiting});
			else console.log('Nie znaleziono proponowanych ofert...');
		});
	}
	
});

router.post('/awaiting/accept',function(req,res){
	if(req.session.nick==undefined){
		res.redirect('/main');
	} else {
		var objectid = mongoose.Types.ObjectId(req.body.id);
		var newCar = new Cars({
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

		newCar.save(function(err){
			if(!err) {
				Awaiting.remove({ _id : objectid },function(err){
					if(!err){
						res.send('accepted');
					} else {
						res.send('denied');
						console.log('Blad usuniecia z oczekujacych zaakceptowanego ogloszenia '+err);
					}
				});

			} else {
				res.send('denied');
				console.log('Blad akceptacji ogloszenia: '+err);
			}
		});
	}
});

router.post('/awaiting/reject',function(req,res){
	var objectid = mongoose.Types.ObjectId(req.body.id);
	Awaiting.remove({ _id : objectid },function(err){
		if(!err){
			res.send('deleted');
		} else {
			res.send('denied');
			console.log('Blad usuniecia z oczekujacych odrzuconego ogloszenia '+err);
		}
	});
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

router.post('/proposal', upload.any(), function(req,res){
	var awaiting = new Awaiting({
		owner: req.session.nick,
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
		place: req.body.place,
		post_date: req.body.post_date,
		filename1: req.body.filename1,
		filename2: req.body.filename2,
		filename3: req.body.filename3,
		filename4: req.body.filename4,
		filename5: req.body.filename5,
		filename6: req.body.filename6
	});	
	awaiting.save(function(err){
		if(!err) {
			console.log('Dodana nowa propozycja ogloszenia. ');
			res.send('added');
		} else console.log('Blad zapisu nowej propozycji ogloszenia: '+err);
	});
});

router.post('/cars/details', function(req,res){
	var id = req.body.id;
	console.log('/cars/details  :'+id);
	var objectid = mongoose.Types.ObjectId(id);
	Cars.findOne({ _id: objectid}, function(err,car){
		if(!err){
			res.render('cars/details.ejs',{car: car});
		} else console.log('Blad w szczegolach ogloszenia: '+err);
	});
});

router.post('/cars/details/edit/:id',function(req,res){
	var id = req.params.id;
	id = id.substr(1);
	var objectid = mongoose.Types.ObjectId(id);
	Cars.findOne({ _id: objectid}, function(err,car){
		if(!err){
			res.render('cars/editad.ejs',{car: car});
		} else console.log('Blad w edycji szczegolow ogloszenia: '+err);
	});
});

router.post('/cars/details/update',function(req,res){
	var id = req.body.id;
	var objectid = mongoose.Types.ObjectId(id);
	var brand = req.body.brand;
	var model = req.body.model;
	var version = req.body.version;
	var year = req.body.year;
	var capacity = req.body.capacity;
	var power = req.body.power;
	var fuel = req.body.fuel;
	var gearbox = req.body.gearbox;
	var drive = req.body.drive;
	var type = req.body.type;
	var doors = req.body.doors;
	var seats = req.body.seats;
	var wheel = req.body.wheel;
	var vat = req.body.vat;
	var place = req.body.place;
	
	// sprawdzamy czy jest w bazie przed edycja
	Cars.findOne({ _id : objectid } ,function(err,result){
		console.log("UPDATE FINDONE: "+result.brand);
		if(!err){
			if(result != null){
				Cars.update(
					{ _id : objectid }, 
					{ $set: { 
						brand: brand, model: model, version: version, year: year,
						capacity: capacity, power: power, fuel: fuel, gearbox: gearbox,
						drive: drive, type: type, doors: doors, seats: seats,
						wheel: wheel, vat: vat, place: place
						}
					},function(err,raw){
						if(err) console.log('Update advertisment: '+err);
						else {
							res.send('updated');
							console.log("Update advertisment raw: "+raw);
						}
					}
				);
				console.log('Zrobilem update ogloszenia. ');
			} else console.log('Nie znaleziono id tego ogloszenia by dokonac edycji...');
		} else console.log('Blad podczas edycji ogloszenia: '+err);
	});
});

router.post('/cars/details/delete',function(req,res){
	var id = req.body.id;
	var objectid = mongoose.Types.ObjectId(id);
	Cars.remove({ _id : objectid },function(err){
		if(!err){
			res.send('deleted');
		} else {
			res.send('denied');
			console.log('Blad usuniecia ogloszenia '+err);
		}
	});
});

router.post('/upload', upload.any(), function(req,res){
	console.log('REQ FILES: '+req.files);
	for(var i in req.files){
		console.log(req.files[i].originalname);
	}
	res.send("ok");
});

module.exports = router;