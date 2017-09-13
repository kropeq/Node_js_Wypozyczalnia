var mongoose = require('mongoose');
var awaitingSchema = new mongoose.Schema({
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
var awaitingModel = mongoose.model('Awaiting',awaitingSchema);

module.exports = awaitingModel;