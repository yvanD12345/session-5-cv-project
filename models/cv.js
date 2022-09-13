

const mongoose = require('./db.js');
const schema = new mongoose.Schema ({
	first_name:String,
	last_name: String,
	email: String,
	user_id: String,
	title: String
})

// pour l'acces dans les autres fichiers
module.exports=mongoose.model('cv',cv,'cvs');