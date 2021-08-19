require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('./morgan')
const errorHandler = require('./errorHandler')
const unknownEndpoint = require('./unknownEndpoint')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url  :status :res[content-length] - :response-time ms :resp'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const info = `Phonebook has info for ${persons.length} people - ${new Date()}`
        response.json(info)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) return response.json(person)
        response.status(404).end()
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(person => {
        if (person) return response.status(204).end()
        response.status(404).end()
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = request.body
    const newPerson = {
        name: person.name,
        number: person.number
    }
    Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
        .then(result => response.json(result))
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
