const { request, response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

let info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) response.json(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.use(express.json())
app.use(morgan('tiny'))


app.post('/api/persons', (request, response) => {
    const body = request.body
    const generateId = () => Math.floor(Math.random() * 100000)

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }

    persons.map(person => { 
        if(person.name === body.name){
            return response.status(409).json({ 
                error: 'name must be unique' 
        })}
    })
   
    person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})