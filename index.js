const express = require("express")
const app = express( );
const morgan = require("morgan")
require('dotenv').config( )

const cors = require("cors")
const Person = require("./models/person")

const PORT = process.env.PORT || 3001


app.use(cors());
app.use(express.json( ));
//adding dist
app.use(express.static("dist"))

//app.use(morgan("tiny"));

//defining a custom token
morgan.token('req-body',(req)=>{
  if (req.method === "POST") {
    return JSON.stringify(req.body);

  }
  return "";
})

//middleware 
app.use(morgan(":method :url :status :res[content-length] - :response-time ms  :req-body"))
//ex-3.13
app.get("/api/persons",(req,res,next)=>{
      Person.find({}).then((persons) => {
        if (persons) {
          res.json(persons)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
      //res.json(persons)

      })
    

    //ex-3.14
    app.post('/api/persons', (req, res,next) => {
      const body = req.body
    
      if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
      }
    
      const person = new Person({
        name: body.name,
        number: body.number ,
      })
    
      person.save().then(savedPerson => {
        res.json(savedPerson)
      })
      .catch(error => next(error))
    })

//ex-3.15
app.delete('/api/persons/:id', (req, res ,next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})