require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    req.body && Object.keys(req.body).length !== 0 ? JSON.stringify(req.body) : ''
  ].join(' ')
}))

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`
      Phonebook has info for ${persons.length} people
      <br/>
      ${new Date()}
    `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
      response.json(person)
  } else {
      response.status(404).send("Object Not Found")
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then((returnPerson) => response.json(returnPerson))

  // if (!body.name || !body.number) {
  //   return response.status(400).json({ 
  //     error: 'parameter missing' 
  //   })
  // } else if(persons.find((person => person.name === body.name))) {
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }

  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: generateId(10, 100000),
  // }

  // persons = persons.concat(person)

  // response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})