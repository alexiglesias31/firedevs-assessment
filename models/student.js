const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    sex: {type: String},
    age: {type: Number, required: true},
    birthdate: {type: Date, required: true},
    city: {type: String, required: true},
    groupId: {type: String, required: true, unique: true}
})

const Student = new mongoose.model('Student', StudentSchema)

module.exports = Student