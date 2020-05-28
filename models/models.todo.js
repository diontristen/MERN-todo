const mongoose = require('mongoose')

// USER SCHEMA FOR DATA
const Schema = mongoose.Schema

const todoSchema = new Schema({
    name: {type:String, required: true, trim: true, minlength:1, maxlength: 20},
    message: {type:String, required:true, trim:true, minlength:1, maxlength: 150},
    date: {type: Date, required:true},
}, {
    timestamps:true,
})

const Todo = mongoose.model('todo', todoSchema)

module.exports = Todo