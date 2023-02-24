const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors());
// app.use(express.static('./build'));

morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body)
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

let data = [
   { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
   },
   { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
   },
   { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
   },
   { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
   },
   { 
    "id": 5,
    "name": "Jombo Wilkins", 
    "number": "265-810-8796"
   }
]

app.get('/info', function (req, res) {
    let currentDate = new Date();
    res.send(
        `<!DOCTYPE html>
        <h2>Phonebook has info for ${ data.length } people</h2>
        <h3>${ currentDate }</h3>`
    );
})

app.get('/api/persons', cors(), (req, res) => {
    res.json(data);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    const person = data.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end;
    }
});

const generateId = () => {
    const maxId = data.length > 0
      ? Math.max(...data.map(n => n.id))
      : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or number not provided'
        })
    }

    const duplicates = data.some(person => person.name  === body.name || person.number === body.number)
    if (duplicates) {
        return res.status(400).json({
            error: 'Name or number already exists'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    data = data.concat(person);

    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    data = data.filter(person => person.id !== id);

    res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })