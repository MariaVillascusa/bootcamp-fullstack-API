require('dotenv').config()
const Person = require('./models/person')
const { request, response, json } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.static('build'))
morgan.token('resp', (response) => {
    return JSON.stringify(response.body)
})

app.use(morgan(':method :url  :status :res[content-length] - :response-time ms :resp'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        let info = `Phonebook has info for ${persons.length} people - ${new Date()}`
        response.json(info)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) return response.json(person)
        response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id).then(person => {
        if (person) return response.status(204).end()
        response.status(404).end()
    })
})


app.use(express.json())

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})