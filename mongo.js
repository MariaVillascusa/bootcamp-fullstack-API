const mongoose = require('mongoose')
const { model, Schema } = mongoose

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://MariaVilla:${password}@cluster0.usqho.mongodb.net/PhonebookApp?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const personSchema = new Schema({
    name: String,
    number: String
})

const Person = model('Person', personSchema)

if (process.argv[3] === undefined) {
    Person.find({})
        .then(result => {
            console.log("Phonebook:");
            result.map(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save()
        .then(result => {
            console.log(`Added ${result.name} number: ${result.number} to phonebook`)
            mongoose.connection.close()
        })
}
