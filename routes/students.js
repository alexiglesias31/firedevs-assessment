const Student = require('../models/student')
const moment = require('moment')

const checkFieldsStudent = (body) => {
    if (body.name && body.email && body.age && body.birthdate && body.city && body.groupId) return true
    return false
}

const validateAge = (age) => {
    if (age.match(/\D/)) return false
    return parseInt(age) > 0 ? true : false
}

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase())
}

const validateDate = (date) => {
    return moment(date, "YYYY-MM-DD", true).isValid()
}

module.exports = function (app) {
    app.route('/api/students')
        .get(async function (req, res) {
            const students = await Student.find({})
            res.json(students)
        })
        .post(async function (req, res) {
            let params = req.body

            if (!checkFieldsStudent(params)) {
                res.status(400).json('Missing required field(s)')
                return
            }

            if (!validateAge(params.age)) {
                res.status(400).json('Age field is not valid')
                return
            }

            if (!validateEmail(params.email)) {
                res.status(400).json('Email field is not valid')
                return
            }

            if (!validateDate(params.birthdate)) {
                res.status(400).json('Birthdate is not valid')
                return
            }

            const newStudent = new Student({
                name: params.name,
                email: params.email,
                sex: params.sex,
                age: params.age,
                birthdate: new Date(params.birthdate),
                city: params.city,
                groupId: params.groupId
            })

            const student = await newStudent.save()
                .catch(error => {
                    res.status(500).json('Could not save student')
                    return
                })

            if (!student) {
                res.status(500).json('Could not save student')
                return
            }

            res.status(200).json(student)
        })
        .delete(async function (req, res) {
            //if successful response will be 'complete delete successful'
            const students = await Student.deleteMany({})

            if (!students) {
                res.json('Could not delete')
                return
            }

            res.json('Complete delete successfully')
        })

    app.route('/api/students/:id')
        .get(async function (req, res) {
            let id = req.params.id

            const student = await Student.findById(id).exec()

            if (!student) {
                res.status(400).json('Student do not exist')
                return
            }

            res.json(student)
        })
        .post(async function (req, res) {
            let params = req.body
            let id = req.params.id

            if (!id) {
                res.status(400).json('Required id field(s) missing')
                return
            }

            if (!Object.keys(params).length) {
                res.status(400).json('Required field(s) missing')
                return
            }

            if (params.age !== undefined && !validateAge(params.age)) {
                res.status(400).json('Age field is not valid')
                return
            }

            if (params.email !== undefined && !validateEmail(params.email)) {
                res.status(400).json('Email field is not valid')
                return
            }

            if (params.birthdate !== undefined && !validateDate(params.birthdate)) {
                res.status(400).json('Birthdate is not valid')
                return
            }

            const student = await Student.findByIdAndUpdate(
                id,
                params,
                {
                    new: true,
                }
            )

            if (!student) {
                res.status(400).json('Student do not exist')
                return
            }

            res.status(200).json(student)
        })
        .delete(async function (req, res) {
            let id = req.params.id

            if (!id) {
                res.status(400).json('Required id field(s) missing')
                return
            }

            //if successful response will be 'delete successful'
            const student = await Student.findByIdAndDelete(id);

            if (!student) {
                res.status(400).json('Student do not exist')
                return
            }

            res.json('Delete successful')
        });
}