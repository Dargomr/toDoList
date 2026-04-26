const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer();
const {v4 : uuidv4} = require('uuid');
const res = require("express/lib/response");
const cors = require('cors');


const connectionUrl = 'mongodb://localhost:27017/toDo';
mongoose.connect(connectionUrl);


const actionSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Должно содержать хотя бы 1 символ']
    },
    checked: {
        type: Boolean,
        default: false
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
        timestamps: true
    }
)

const Action = mongoose.model('actions', actionSchema) 

app.set('view engine', 'ejs');

app.use(express.static('assets'))

app.use(multer().none());

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cors());

app.get('/api/tasks', async function(request, response) {
try {
    const tasks = await Action.find().sort({ createdAt: -1 });
    response.json(tasks);
} catch (err) {
    console.log(err);
    response.status(500).json({error: err.message});
}
})

app.get('/', async function(request, response) {
    const ulActions = Array.from(await Action.find());
    const data = {ulActions : ulActions}
    response.render('main', data);
})

app.post('/add', async function(request, response) {
    try {
        const {inputField} = request.body;

        if (!inputField || inputField.trim() === '') {
            return response.status(400).json({ error: 'Поле не должно быть пустым' })
        }

        if (inputField.length > 100) {
            return response.status(400).json({ error: 'Слишком длинное действие'})
        }

        let uuid = uuidv4()
        let res = {
            uuid: uuid,
        }
        let newAction = new Action({
            uuid: uuid,
            action: inputField,
            checked: false,
            done: false,
        })

        await newAction.save();
        response.json(res)
    } catch(err) {
        console.log(err)
        response.status(500).json({ error: err.message })
    }
})

app.post('/done', async function(request, response) {
    await Action.updateOne({uuid: request.body.uuid}, {$set: {done: request.body.done}})
    response.json({ success: true })
})

app.post('/check', async function(request, response) {
    await Action.updateOne({uuid: request.body.uuid}, {$set: {checked: request.body.checked}})
    response.json({ success: true })
})

app.post('/delete', async function(request, response) {
    await Action.deleteOne({uuid: request.body.uuid})
    response.json({ success: true })
})

app.post('/checkCreate', async function(request, response) {
    const uuids = request.body;

    if (!Array.isArray(uuids) || uuids.length === 0) {
        return response.status(400).json({
            error: 'Нужен массив uuids для удаления'
        })
    }

    const res = await Action.find({uuid: uuids})


    response.json(res[0].checked)
})

app.post('/deleteAllChecked', async function(request, response) {
    const uuids = request.body.uuids;
    if (!uuids || uuids.length === 0) {
        return response.status(400).json({error: 'Нет uuid для удаления'})
    }
    await Action.deleteMany({uuid: {$in: uuids} })
    response.json({ Deleted: uuids.length})
})

app.post('/completeAllChecked', async function(request, response) {
    const { uuids } = request.body;
    await Action.updateMany(
        {uuid: {$in: uuids}},
        {$set: {done: true}}
    )
    // response.json({ Updated: uuids.length})
})



app.listen(3000, () => console.log('/server is running'))