var mongoose = require('mongoose');
var awaitingSchema = new mongoose.Schema({
	owner: 'string',
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
	place: 'string',
	post_date: 'string',
	filename1: 'string',
	filename2: 'string',
	filename3: 'string',
	filename4: 'string',
	filename5: 'string',
	filename6: 'string'
});
var awaitingModel = mongoose.model('Awaiting',awaitingSchema);

module.exports = awaitingModel;