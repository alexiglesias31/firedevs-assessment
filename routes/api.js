module.exports = function (app) {
    app.route('/api')
        .get(function (req, res) {
            res.json('Hello from the server')
        })
}