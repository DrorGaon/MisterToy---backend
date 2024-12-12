import path from 'path'
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
        name: req.query.name || '',
        price: req.query.price || 0,
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

app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId)
        .then((toys) => res.send(toys))
        .catch(err => {
            loggerService.error(err)
            res.status(500).send('Problem removing toy')
        })
})

app.post('/api/toy/', (req, res) => {

    const toyToSave = req.body

    toyService.save(toyToSave)
        .then((toy) => res.send(toy))
        .catch(err => {
            loggerService.error(err)
            res.status(500).send('Problem adding toy')
        })
})

app.put('/api/toy/:toyId', (req, res) => {

    const toyToSave = req.body

    toyService.save(toyToSave)
        .then(savedToy => res.send(savedToy))
        .catch((err) => {
            loggerService.error('Cannot update toy', err)
            res.status(400).send('Cannot update toy', err)
        })
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(3030, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))