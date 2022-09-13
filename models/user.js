const mongoose = require('./db.js');
const schema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	Password: {
		type: String, set(val) {
			return require('bcrypt').hashSync(val, 10)
		}
	},

})
const user = mongoose.model("client", schema);

// pour l'acces dans les autres fichiers
module.exports = user;
module.exports = mongoose.model('Client', client, 'Clients');
