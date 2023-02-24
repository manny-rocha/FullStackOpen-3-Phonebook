require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Entry = require('./models/entry')

const app = express()


app.use(express.static('build'));
app.use(cors());

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      req.method === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
}))

app.use(express.json())

let data = [];

app.get('/info', function (req, res) {
    let currentDate = new Date();
    res.send(
        `<!DOCTYPE html>
        <h2>Phonebook has info for ${ data.length } people</h2>
        <h3>${ currentDate }</h3>`
    );
})

app.get('/api/persons', (req, res) => {
    Entry.find({}).then()(entries => {
        res.json(entries);
    })
});

app.get('/api/persons/:id', (req, res) => {
    Entry.findById(req.params.id).then(entry => {
        res.json(entry);
    });
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({
            error: 'Name or number not provided'
        })
    }

    // const duplicates = data.some(person => person.name  === body.name || person.number === body.number)
    // if (duplicates) {
    //     return res.status(400).json({
    //         error: 'Name or number already exists'
    //     })
    // }

    const entry = new Entry({
        name: body.name,
        number: body.number,
    })
    
    entry.save().then(savedEntry => {
        res.json(savedEntry)
    }) 
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    data = data.filter(person => person.id !== id);

    res.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })