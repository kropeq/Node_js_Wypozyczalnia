var express = require('express');
var session = require('express-session');
var ejs = require('ejs');

// sluzy do odkodowania URL, z którego pobrane są dane POST METHOD
// za pomocą req.body.nazwa		(localhost:3000/login?nazwa=kropeq)
var bodyParser = require('body-parser');	

var app = express();

// statyczne wystawianie css i js
app.use(express.static(__dirname + '/public'));

// odczytuje przekazane parametry przez URL $.post('/main',{zmienna:"tekst"},...)
// app.post('/main',function(req,res){ var zmienna = req.body.zmienna });
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(session({
	secret: 'sekret',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));

// ustalenie sciezki widokow aplikacji ( stała: 'views')
app.set('views', __dirname + '/views');

// widoki będą w formacie ejs
app.set('view engine','ejs');

// zdefiniowanie serwera express
var http = require('http').Server(app);

// definicje ścieżek zawarte w /app/routes.js
app.use(require('./app/routes'));

// serwer http na express dziala na porcie 8080
http.listen(8080, function(req,res){
	console.log("Server is running on localhost:8080");
});