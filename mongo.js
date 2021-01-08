const mongoose = require('mongoose')
const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.lc4tb.mongodb.net/numbers?retryWrites=true&w=majority`
  
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', numberSchema)

const number = new Person({
  name: process.argv[3],  
  number: process.argv[4],
})

if (process.argv.length<3) {
  console.log('give a password as an argument')
  process.exit(1)
} else if (process.argv.length === 3) {
  console.log('Phonebook: ')
  Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length > 4) {
  number.save()
    .then(() => {
      console.log(`Added ${number.name} number ${number.number} to the phonebook`)
      mongoose.connection.close()
    })
    .catch(error => next(error))
}