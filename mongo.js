const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://fullstackopen:${password}@cluster0.begpsjv.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

// Define Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

const listPeople = () => {
    mongoose
    .connect(url)
    .then(() => {
        Person.find({}).then(result => {
            console.log('phonebook:')
            result.forEach(person => {
              console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))
}

const savePerson = (argv) => {
    mongoose
    .connect(url)
    .then(() => {
        const person = new Person({
            name: argv[3],
            number: argv[4]
        })
        return person.save()
    })
    .then((result) => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

switch(process.argv.length) {
    case 3:
        listPeople()
        break;
    case 5:
        savePerson(process.argv)
        break;
    default:
        console.log(`
            Please provide arguments: 
            - node mongo.js <password>
            - node mongo.js <password> <Name> <PhoneNumber>
        `)
        process.exit(1)
}