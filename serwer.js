var express = require('express');
var app = express();

// statyczne wystawianie css i js z folderu public
app.use(express.static(__dirname + '/public'));

// ustalenie sciezki widokow aplikacji ( stała: 'views')
app.set('views', __dirname + '/views');

// zdefiniowanie rozszerzen plikow html
app.engine('html',require('ejs').renderFile);

// widoki będą w formacie html
app.set('view engine','html');

// zdefiniowanie serwera express
var http = require('http').Server(app);

// definicje ścieżek zawarte w /app/routes.js
app.use(require('./app/routes'));

// serwer http na express dziala na porcie 8080
http.listen(8080, function(req,res){
	console.log("Server is running on localhost:8080");
});