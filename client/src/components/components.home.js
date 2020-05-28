import React, {Component} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2'



const List = data => (
    <div className="card is-mt-5">
        <header className="card-header">
            <p className="card-header-title has-text-danger">
            {data.data.title}
            </p>
        </header>
        <div className="card-content">
            <div className="content">
                <p><strong className="has-text-danger">{data.data.name}</strong> will,</p>
                {data.data.message}
                <p className="is-mt-5"><strong className="is-mr-5">on:</strong> <span className="has-text-danger">{data.date}</span></p>
            </div>
        </div>
        <footer className="card-footer">
            <button  onClick={() => {data.editBtn(data.data.name, data.data.title, data.data.message, data.data.date, data.data._id)}}  className="card-footer-item has-text-danger is-anti-button"> <i className="fas fa-edit is-mr-5 "></i>  Edit</button>
            <button onClick={() => {data.delBtn(data.data._id)}} className="card-footer-item has-text-danger is-anti-button"> <i className="fas fa-trash is-mr-5"></i>   Delete</button>
        </footer>
    </div>
)






export default class HomePage extends Component {
    constructor(props) {
    super(props)

    this.getAll = this.getAll.bind(this)
    this.onModalClose = this.onModalClose.bind(this)
    this.openAddModal = this.openAddModal.bind(this)
    this.openEditModal = this.openEditModal.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
    this.onChangeEdit = this.onChangeEdit.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.isEmpty = this.isEmpty.bind(this)
    this.showSwal = this.showSwal.bind(this)
    this.onDelete = this.onDelete.bind(this)
    
    this.state = {
        addModalClass: 'modal is-hidden',
        addMessageClass: 'textarea',
        addMessageErr: '',
        editModalClass: 'modal is-hidden',
        editMessageClass: 'textarea',
        editMessageErr: '',
        addCount: 0,
        editCount: 0,
        startDate: new Date(),
        add: {
            name: '',
            title: '',
            message: '',
            date: new Date(),
        },
        edit: {
            name: '',
            title: '',
            message: '',
            date: '', 
            id: ''
        },
        nameErr: '',
        titleErr: '',
        messageErr: '',
        dateErr: '',
        nameClass: 'input',
        titleClass: 'input',
        messageClass: 'textarea',
        dateClass: 'input',
        todo: []
    }


    }

    componentDidMount() {
        this.getAll()
    }
    onChangeEdit(e) {
        this.state.edit[e.target.name] = e.target.value
        let CLASS = e.target.name + "Class"
        let ERROR = e.target.name + "Err"
        let value = 'input'
        console.log(this.state.edit)
        if (e.target.name === 'message') {
            value = 'textarea'
        }
        this.setState({
            [CLASS]: value,
            [ERROR]: ''
        })
    }

    onChangeInput(e) {
        this.state.add[e.target.id] = e.target.value
        let CLASS = e.target.id + "Class"
        let ERROR = e.target.id + "Err"
        let value = 'input'
        if (e.target.id === 'message') {
            value = 'textarea'
        }
        this.setState({
            [CLASS]: value,
            [ERROR]: ''
        })
    }

    handleChange = value => {
        this.state.add.date = value
        this.setState({
            dateErr: '',
            dateClass: 'input'
        })
        
    }
    
    isEmpty(data) {
        console.log(data)
        let valid = true
        for (let key in data) {
            if (data[key].length <= 0) {
                let ERROR = key + "Err"
                let CLASS = key + "Class"
                this.setState({
                    [ERROR]: key + ' cannot be empty.',
                    [CLASS]: this.state[CLASS] + ' is-danger'
                })
                valid = false
            }
        }
        return valid
    }

    async onAdd(e) {
        e.preventDefault()
        let error = this.isEmpty(this.state.add)
        if (error === true) {
            await fetch('http://localhost:5000/add', {
                method: "POST",
                headers: {"Content-Type": "application/json"},  
                body: JSON.stringify(this.state.add)
            })
            .then(res => res.json())
            .then(json => {
                if (json.status === true) {
                    this.setState({
                        todo:  this.state.todo.filter(el => el._id !== json.data._id)
                    })
                    this.state.todo.unshift(json.data)
                    this.setState(prevState => ({
                        addModalClass: 'modal is-hidden',
                        todo: prevState.todo,
                        addModalClass: 'is-hidden',
                        editModalClass: 'is-hidden',
                        nameErr: '',
                        titleErr: '',
                        messageErr: '',
                        dateErr: '',
                        nameClass: 'input',
                        titleClass: 'input',
                        messageClass: 'textarea',
                        dateClass: 'input',
                    }))
                    this.showSwal(json.message, 'success')
                } else {
                    this.showSwal(json.message, 'failed')
                }
            })
        }
    }

    async onEdit(e) {
        e.preventDefault()
        let error = this.isEmpty(this.state.edit)
        if (error === true) {
            await fetch('http://localhost:5000/update', {
                method: "POST",
                headers: {"Content-Type": "application/json"},  
                body: JSON.stringify(this.state.edit)
            })
            .then(res => res.json())
            .then(json => {
                if (json.status === true) {
                    var index = this.state.todo.findIndex(x => x._id === json.data._id)
                    this.state.todo[index] = json.data
                    this.setState(prevState => ({
                        editModalClass: 'modal is-hidden',
                        todo: prevState.todo,
                        addModalClass: 'is-hidden',
                        editModalClass: 'is-hidden',
                        nameErr: '',
                        titleErr: '',
                        messageErr: '',
                        dateErr: '',
                        nameClass: 'input',
                        titleClass: 'input',
                        messageClass: 'textarea',
                        dateClass: 'input',
                    }))
                  
                    this.showSwal(json.message, 'success')
                } else {
                    this.showSwal(json, 'failed')
                }
            })
        }
    }

    showSwal(message, icon) {
        Swal.fire({
            icon: icon,
            title: message,
            showConfirmButton: false,
            timer: 2000,
          })
    }
    openEditModal(name, title, message, date, id) {
        document.getElementById('ename').value = name
        document.getElementById('etitle').value = title
        document.getElementById('emessage').value = message
        this.setState({
            edit: {
                name: name,
                title: title,
                message: message,
                date: new Date(date),
                id: id
            }
        })
        this.setState({
            editModalClass: 'modal is-active',
        })
    }

    openAddModal() {
        this.setState({
            addModalClass: 'modal is-active',
        })
    }

    onModalClose(e) {
        e.preventDefault()
        document.getElementById('addForm').reset()
        this.setState({
            addModalClass: 'is-hidden',
            editModalClass: 'is-hidden',
            nameErr: '',
            titleErr: '',
            messageErr: '',
            dateErr: '',
            nameClass: 'input',
            titleClass: 'input',
            messageClass: 'textarea',
            dateClass: 'input',
        })
    }
    async getAll() {
       let parent = this
       await fetch('http://localhost:5000/getAll', {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === true) {
                parent.setState({
                    todo: json.data
                })
                
            }
        })
    }

    onDelete(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async (result) => {
            if (result.value) {
                await fetch('http://localhost:5000/delete', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        id: id
                    })
                })
                .then(res => res.json())
                .then(json => {
                    if (json.status === true) {
                        this.setState({
                            todo:  this.state.todo.filter(el => el._id !== json.id)
                        })
                        this.showSwal('Todo has been deleted.', 'success')
                    } else {
                        this.showSwal('There was an error upon deleting your todo.', 'failed')
                    }
                })
            }
          })
    }


    todoList() {
        let count = 0
        return this.state.todo.map(todo => {
            count++
            let temp = new Date(todo.date)
            let date = temp.toLocaleString(undefined,{
                day:'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).replace(/\//g, '-')
          return <List data={todo} key={count} date={date} delBtn={this.onDelete} editBtn={this.openEditModal}/>;
        })
    }




    render() {
        return (
            <div>
            <div className="container-fluid">
                <div className="columns is-mobile">
                    <div className="column is-3"></div>
                    <div className="column is-6">
                        <section className="hero is-danger">
                            <div className="hero-body is-pb-20">
                                <div className="container">
                                <h1 className="title">
                                    ToDo - App
                                </h1>
                                <h2 className="subtitle">
                                A basic CRUD MERN Application
                                </h2>
                                </div>
                            </div>
                            <div className="has-text-right is-m-5">
                              
                                <span onClick={this.openAddModal}><i  className="fas fa-plus-circle is-m-5 fa-3x is-hover"></i></span>
                            </div>
                            </section>

                            { this.todoList() }
                         

                    </div>
                    <div className="column is-3"></div>
                </div>

            </div>

            <div className={this.state.addModalClass}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <section className="modal-card-body">
                                <div className="is-mb-5">
                                    <p className="title">Add some <span className="has-text-danger">TODO</span></p>
                                    <p className="subtitle">All fields are required.</p>
                                </div>

                                <form id="addForm">
                                    <div className="field">
                                        <label className="label">Name</label>
                                        <div className="control">
                                            <input className={this.state.nameClass} id="name" onChange={this.onChangeInput} type="text" placeholder="Text input"/>
                                            <span className="help is-danger">{this.state.nameErr} </span    >
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">ToDo Title</label>
                                        <div className="control">
                                            <input className={this.state.titleClass} id="title" onChange={this.onChangeInput}  type="text" placeholder="Text input"/>
                                            <span className="help is-danger">{this.state.titleErr} </span>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">Message</label>
                                        <div className="control">
                                            <textarea className={this.state.messageClass} id="message" onChange={this.onChangeInput} placeholder="Textarea"></textarea>
                                            <span className="help is-danger">{this.state.messageErr} </span>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">Date and Time</label>
                                        <div className="control">
                                        <DatePicker className={this.state.dateClass}
                                                selected={this.state.startDate}
                                                onChange={this.handleChange}
                                                minDate={new Date()}
                                                showTimeSelect
                                                timeFormat="h:mm aa"
                                                timeIntervals={1}
                                                timeCaption="time"
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                withPortal
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </div>
                                        <span className="help is-danger">{this.state.dateErr} </span    >
                                    </div>


                                    <div className="field is-grouped is-grouped-right">
                                        <div className="control">
                                            <button className="button is-link is-danger" onClick={this.onAdd}>Submit</button>
                                        </div>
                                        <div className="control">
                                            <button onClick={this.onModalClose} className="button is-outlined">Cancel</button>
                                        </div>
                                    </div>
                                </form>
                        </section>
                    </div>
                </div>



                <div className={this.state.editModalClass}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <section className="modal-card-body">
                                <div className="is-mb-5">
                                    <p className="title">Edit <span className="has-text-danger">TODO</span></p>
                                    <p className="subtitle">All fields are required.</p>
                                </div>

                                <form id="editForm">
                                    <div className="field">
                                        <label className="label">Name</label>
                                        <div className="control">
                                            <input className={this.state.nameClass} name="name" id="ename" onChange={this.onChangeEdit} type="text" placeholder="Text input"/>
                                            <span className="help is-danger">{this.state.nameErr} </span    >
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">ToDo Title</label>
                                        <div className="control">
                                            <input className={this.state.titleClass} name="title" id="etitle" onChange={this.onChangeEdit}  type="text" placeholder="Text input"/>
                                            <span className="help is-danger">{this.state.titleErr} </span>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">Message</label>
                                        <div className="control">
                                            <textarea className={this.state.messageClass} name="message" id="emessage" onChange={this.onChangeEdit} placeholder="Textarea"></textarea>
                                            <span className="help is-danger">{this.state.messageErr} </span>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">Date and Time</label>
                                        <div className="control">
                                        <DatePicker 
                                                id="edate"
                                                className={this.state.dateClass}
                                                selected={this.state.edit.date}
                                                onChange={this.handleChange}
                                                minDate={new Date()}
                                                showTimeSelect
                                                timeFormat="h:mm aa"
                                                timeIntervals={1}
                                                timeCaption="time"
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                withPortal
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </div>
                                        <span className="help is-danger">{this.state.dateErr} </span    >
                                    </div>


                                    <div className="field is-grouped is-grouped-right">
                                        <div className="control">
                                            <button className="button is-link is-danger" onClick={this.onEdit}>Submit</button>
                                        </div>
                                        <div className="control">
                                            <button onClick={this.onModalClose} className="button is-outlined">Cancel</button>
                                        </div>
                                    </div>
                                </form>
                        </section>
                    </div>
                </div>





        </div>
        )
    }
}