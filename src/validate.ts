import { app, router } from './wrapper/express'
import bodyparser from './wrapper/body-parser'
import upload from './wrapper/multer'
import { validate as OMSValidate } from '@microservices/validate'

class Validate {
  constructor() {
    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({ extended: false }))
    app.use(upload.array())

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      next()
    })

    router.post('/validate', (req, res) => {
      if (!req.body.file) {
        res.status(200).send('No file provided')
        return
      }
      try {
        res.status(200).send(OMSValidate(req.body.file))
      } catch (e) {
        res.status(200).send(e)
      }
    })

    router.get('/health', (req, res) => {
      res.status(200).send()
    })

    app.use(router)

    app.listen(5000)
  }
}

const validate = new Validate()
