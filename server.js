const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const mEnv = require('./middleware/middleware.env')



const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


/**
 * MongoDB (Database) Declaration and Connection
 */
const mongoURI = mEnv.MONGO_URI 
mongoose.connect(mongoURI, {useNewUrlParser:true, useCreateIndex:true,  useUnifiedTopology: true})
const mongoConnection = mongoose.connection
mongoConnection.once('open', () => {
    console.log("MongoDB database connection established succesfully")
})

const todoRouter = require('./routes/routes.todo')
app.use('/', todoRouter)


if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'frontend/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html')); // relative path
    });
}



/**
 * Run the Application
 * PORT => 5000
 * IP => localhost/local_ip
 */
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is up and running: ${port}`)
})