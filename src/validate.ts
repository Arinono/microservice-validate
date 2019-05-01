import { app, router } from './wrapper/express'
import bodyparser from './wrapper/body-parser'
import upload from './wrapper/multer'
import yamljs from './wrapper/yamljs'
import Microservice from './models/Microservice'
import * as utils from './utils'

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
      const json = this.readYAML(req.body.file)
      const options = {}
      try {
        utils.checkActionInterface(json)
        const m = new Microservice(json)
        res.status(200).send(this.processValidateOutput(m.rawData, options))
      } catch (e) {
        res.status(200).send(this.processValidateOutput(e, options))
      }
    })

    app.use(router)

    app.listen(5000)
  }

  private readYAML(file: string): string {
    try {
      return yamljs.parse(file)
    } catch (e) {
      return `Issue with microservice.yml: ${e.message}`
    }
  }

  private processValidateOutput(data: any, options: any): string {
    if (options.json) {
      return JSON.stringify(data, null, 2)
    } else if (options.silent) {
      return ''
    } else {
      let errorString
      if (!data.text) {
        errorString = `${data.context} has an issue. ${data.message}`
      } else {
        errorString = data.text
      }
      if (errorString === 'No errors') {
        return errorString
      }
      const errors = errorString.split(', ')
      const errorCount = errors.length
      const formattedError = [
        `${errorCount} error${errorCount === 1 ? '' : 's'} found:`
      ]
      for (let i = 0; i < errors.length; i += 1) {
        formattedError.push(`\n  ${i + 1}. ${errors[i]}`)
      }
      return formattedError.join('')
    }
  }
}

const validate = new Validate()
