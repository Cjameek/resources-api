
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema);