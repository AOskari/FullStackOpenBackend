const { response } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
const date = new Date()
var morgan = require('morgan')
app.use(morgan(':method :url :status :response-time ms - :person'))
morgan.token('person', function (req, res) {
  return JSON.stringify(req.body)
})

const cors = require('cors')
app.use(cors())


let persons = [
  { 
    name: "Arto Hellas", 
    number: "040-123456",
    id: 1
  },
  { 
    name: "Ada Lovelace", 
    number: "39-44-5323523",
    id: 2
  },
  { 
    name: "Dan Abramov", 
    number: "12-43-234345",
    id: 3
  },
  { 
    name: "Mary Poppendieck", 
    number: "39-23-6423122",
    id: 4
  }
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(number => number.id))
    : 0
  return maxId + 1
}


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}<p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
 
  if (person) {
    response.json(person)
  } else {
      response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.filter(person => person.id !== id)

  if (person) {
    response.json(person)
  } else {
    response.status(204).end()
  } 
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  } else if (!body.number){
    return response.status(400).json({ 
      error: 'number missing' 
    })
  } else if (persons.find(person => person.name === body.name)){
    return response.status(400).json({ 
      error: `${body.name} has already been added to the phonebook`
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  console.log(person)
  persons = persons.concat(person)
  response.json(person)
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})