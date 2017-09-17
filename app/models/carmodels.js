var mongoose = require('mongoose');
var carmodelSchema = new mongoose.Schema({
	brand: 'string',
	model: 'string',
	version: 'string',
	startyear: 'string',
	endyear: 'string'
});
var carmodelsModel = mongoose.model('CarModels',carmodelSchema);

module.exports = carmodelsModel;