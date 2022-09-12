

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
    user_id : {
        type: String, required: true 
    },
    title:{
        type: String, required:true
    },
})
    const cv = mongoose.model("cv", schema);

// pour l'acces dans les autres fichiers
module.exports = cv;

