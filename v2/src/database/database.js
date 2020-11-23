//setting up mongoose
const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb://localhost:27017/reactions', {useNewUrlParser: true, useUnifiedTopology: true});