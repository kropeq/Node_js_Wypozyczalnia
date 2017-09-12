var f='app/collections/cars.txt';
var fs=require('fs');

function Car(marka,model,wersja,rocznik,pojemnosc,moc) {
	this.marka = marka;
	this.model = model;
	this.wersja = wersja;
	this.rocznik = rocznik;
	this.pojemnosc = pojemnosc;
	this.moc = moc;
}

cars = new Array();
cars.push(new Car("Mazda","6","GH/GJ 2005-2008","2007","1 995cm3","143 KM"));
cars.push(new Car("Hyundai","Accent","LS 1997-2001","1999","1 349cm3","75 KM"));

fs.writeFile(f,"",function(err){
	if(err) console.error(err);
	console.log('Appended!');
});
for(var i in cars){
	fs.appendFile(f,
		cars[i].marka+","+
		cars[i].model+","+
		cars[i].wersja+","+
		cars[i].rocznik+","+
		cars[i].pojemnosc+","+
		cars[i].moc+"\r\n"
		,function(err){
		if(err) 
			console.error(err);
		console.log('Appended '+cars[i].marka+' '+ cars[i].model+'!');
	});
}