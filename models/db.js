const mongoose = require('mongoose');

//url for mongodb altas
const URL = ''


//connect to mongoose
mongoose.connect(URL, async (err) => {
    if (err) throw err;
    console.log('connected to db')
});

module.exports = mongoose;