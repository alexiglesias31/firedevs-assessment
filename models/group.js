const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
    name: {type: String, required: true},
    professor: {type: String, required: true},
})

const Group = new mongoose.model('Group', GroupSchema)

module.exports = Group