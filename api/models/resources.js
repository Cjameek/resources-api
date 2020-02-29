const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    category: String,
    resourceFile: String
})

module.exports = mongoose.model('Resource', resourceSchema);