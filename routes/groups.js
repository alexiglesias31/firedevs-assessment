const Group = require('../models/group')

module.exports = function(app) {
    app.route('/api/groups')
        .get(async function (req, res) {
            const groups = await Group.find({})
            res.json(groups)
        })
        .post(async function (req, res) {
            let params = req.body

            if(!params) {
                res.status(400).json('Missing required fields')
                return
            }

            if (params.name === undefined) {
                res.status(400).json('Required field name missing')
                return
            }

            if (params.professor === undefined) {
                res.status(400).json('Required field professor missing')
                return
            }

            const newGroup = new Group({
                name: params.name,
                professor: params.professor,
            })

            const group = await newGroup.save()
                .catch(error => {
                    res.status(500).json('Could not save group')
                    return
                })

            if (!group) {
                res.status(500).json('Could not save group')
                return
            }

            res.status(200).json(group)
        })
        .delete(async function (req, res) {
            //if successful response will be 'complete delete successful'
            const groups = await Group.deleteMany({})

            if (!groups) {
                res.json('Could not delete')
                return
            }

            res.json('Complete delete successfully')
        })

    app.route('/api/groups/:id')
        .get(async function (req, res) {
            let id = req.params.id

            const group = await Group.findById(id).exec()

            if (!group) {
                res.status(400).json('Group do not exist')
                return
            }

            res.json(group)
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

            const group = await Group.findByIdAndUpdate(
                id,
                params,
                {
                    new: true,
                }
            )

            if (!group) {
                res.status(400).json('Group do not exist')
                return
            }

            res.status(200).json(group)
        })
        .delete(async function (req, res) {
            let id = req.params.id

            if (!id) {
                res.status(400).json('Required id field(s) missing')
                return
            }

            //if successful response will be 'delete successful'
            const group = await Group.findByIdAndDelete(id);

            if (!group) {
                res.status(400).json('Group do not exist')
                return
            }

            res.json('Delete successful')
        })
}