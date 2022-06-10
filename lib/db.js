const mongoose = require('mongoose');
const config = require('./config');

// const credentials = {
//     user: username,
//     pass: password
// };

const db = mongoose.connect(
    `mongodb://${config.db.host}/${config.db.database}`,
    // credentials
);

module.exports = db;
