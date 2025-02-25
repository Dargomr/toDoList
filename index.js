const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer();
const {v4 : uuidv4} = require('uuid');

const connectionUrl = 'mongodb://localhost:27017/toDo';
mongoose.connect(connectionUrl);

const actionSchema = {
    uuid: String,
    action: String,
    checked: Boolean,
    done: Boolean,
}

const Action = mongoose.model('actions', actionSchema) 

app.set('view engine', 'ejs');

app.use(express.static('assets'))

app.use(multer().none());

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.get('/', async function(request, response) {
    const ulActions = Array.from(await Action.find());
    const data = {ulActions : ulActions}
    response.render('main', data);
})

app.post('/add', function(request, response) {
    try {
        let obj = request.body;
        let uuid = uuidv4()
        let res = {
            uuid: uuid,
        }
        let newAction = new Action({
            uuid: uuid,
            action: obj.inputField,
            checked: false,
            done: false, 
        })

        newAction.save();
        response.json(res)
    } catch(err) {
        console.log(err)
    }
})

app.post('/done', async function(request, response) {
    await Action.updateOne({uuid: request.body.uuid}, {$set: {done: request.body.done}})
})

app.post('/check', async function(request, response) {
    await Action.updateOne({uuid: request.body.uuid}, {$set: {checked: request.body.checked}})
})

app.post('/checkCreate', async function(request, response) {
    let res = await Action.find({uuid: request.body.uuid})
    response.json(res[0].checked)
})

app.post('/deleteAll', async function(request, response) {
    let mass = []
    await Action.deleteMany({uuid: request.body})
})

app.post('/completeAll', async function(request, response) {
    let mass = []
    await Action.updateMany({checked: true}, {$set: {done: true}})
})

app.post('/delete', async function(request, response) {
    await Action.deleteOne({uuid: request.body.uuid})
})


app.listen(3000, () => console.log('/huynya zapustilasb'))