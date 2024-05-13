const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    graff: { type: mongoose.Schema.Types.ObjectId, ref: 'Graff', required: true},
    description: { type: String, required: true}
});

module.exports = mongoose.model('Blog', blogSchema);