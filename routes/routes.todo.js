const router = require('express').Router()
let validator = require('../middleware/middleware.validation')
let Todo = require('../models/models.todo')


router.route('/getAll').get((req, res) => {
    Todo.find()
    .then(todo => {
        res.json({
            status: true,
            data: todo
        })
    })
    .catch(err => {
        res.json({
            status: false,
            message: "System Error"
        })
    })
})

router.route('/getById').get((req, res) => {
    Todo.findById(req.body.id)
    .then(todo => {
        res.json({
            status: true,
            data: todo
        })
    })
    .catch(err => {
        res.json({
            status: false,
        })
    })
})

router.route('/add').post((req, res) => {
    if (validator.isEmpty(req.body).status === false) {
        res.json({
            status:false,
            data: error,
        })
        return
    }

    const newTodo = new Todo({
        name: req.body.name,
        message: req.body.message,
        date: new Date(req.body.date)
    });
    newTodo.save()
    .then(() => res.json({
        status:true,
        data: newTodo,
        message:"Todo has been successfully added!"})
        )
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update').post((req, res) => {
    if (validator.isEmpty(req.body).status === false) {
        res.json({
            status:false,
            data: error,
        })
        return
    }

    const newTodo = {
        name: req.body.name,
        message: req.body.message,
        date: new Date(req.body.date)
    }

    Todo.findByIdAndUpdate(req.body.id)
    .then(todo => {
        todo.name = req.body.name
        todo.message = req.body.message
        todo.date = new Date(req.body.date)
        todo.save()
        .then(todo => {
            res.json({
                status: true,
                data: todo
            })
        })
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/delete').post((req, res) => {
    if (validator.isEmpty(req.body).status === false) {
        res.json({
            status:false,
            data: error,
        })
        return
    }

    Todo.findByIdAndDelete(req.body.id)
    .then(todo => {
        todo.delete()
        .then(() =>  res.json({
            status: true,
        }))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(error => res.json({
        status: false,
        message: error
    }))
})



module.exports = router;
