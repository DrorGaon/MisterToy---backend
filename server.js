import express from 'express'
import cookieParser from 'cookie-parser'
import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/toy', (req, res) => {
    
    const filterBy = {
        text: req.query.text || '',
        minSeverity: req.query.minSeverity || 0,
        sortBy: req.query.sortBy || ''
    }

    toyService.query(filterBy)
        .then((toys) => res.send(toys))
        .catch(err => {
            loggerService.error(err)
            res.status(500).send('Problem getting toys')
        })
})

app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService.get(toyId)
        .then((toy) => { res.send(toy) })
        .catch(err => {
            loggerService.error(err)
            res.status(500).send('Problem getting toy')
        })
})

const port = process.env.PORT || 3030
app.listen(3030, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))