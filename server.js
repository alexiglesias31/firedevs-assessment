const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))

const startApp = async () => {
  // Connect to DB
  await mongoose
    .connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    
  //Start our server and tests!
  app.listen(process.env.PORT || 50000, function () {
    console.log("Listening on port " + process.env.PORT);
  });
}

startApp()

// Export our app for testing purposes
export default app;