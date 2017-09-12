var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	nickname: 'string',
	password: 'string',
	name: 'string',
	surname: 'string',
	country: 'string',
	phone: 'string',
	email: 'string',
	priviliges: 'string'
});
var userModel = mongoose.model('Users',userSchema);

module.exports = userModel;