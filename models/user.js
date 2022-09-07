const mongoose = require('mongoose');
const schema = new mongoose.Schema ({
    first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	user_type: {
		type: String,
		enum: ["client", "entreprise","admin"],
		default: "client",
		required: true,
	},
	
})
const user = mongoose.model("client", schema);

// pour l'acces dans les autres fichiers
module.exports = user;
