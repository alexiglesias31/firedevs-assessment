const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const apiRouter = require('./routes/api')
const studentsRouter = require('./routes/students')
const groupsRouter = require('./routes/groups')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add routes
apiRouter(app)
studentsRouter(app)
groupsRouter(app)

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    //Start our server
    app.listen(process.env.PORT || 50000, function () {
      console.log("Listening on port " + process.env.PORT);
    });
  })



module.exports = app