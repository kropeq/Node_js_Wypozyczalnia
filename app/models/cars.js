var mongoose = require('mongoose');
var carSchema = new mongoose.Schema({
	brand: 'string',
	model: 'string',
	version: 'string',
	year: 'string',
	capacity: 'string',
	power: 'string',
	fuel: 'string',
	gearbox: 'string',
	drive: 'string',
	type: 'string',
	doors: 'string',
	seats: 'string',
	wheel: 'string',
	vat: 'string',
	place: 'string'
});
var carModel = mongoose.model('Cars',carSchema);

module.exports = carModel;