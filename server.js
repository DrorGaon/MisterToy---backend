import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
    ],
    credentials: true,
}
app.use(cors(corsOptions))

app.get('/api/toy', async (req, res) => {
    
    const filterBy = {
        name: req.query.name || '',
        price: req.query.price || 0,
    }

    try {
        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (err) {
        loggerService.error(err)
        res.status(500).send('Problem getting toys')
    }
})

app.get('/api/toy/:toyId', async (req, res) => {
    
    const { toyId } = req.params

    try {
        const toy = await toyService.get(toyId)
        res.send(toy)
    } catch (err) {
        loggerService.error(err)
        res.status(500).send('Problem getting toy')
    }
})

app.delete('/api/toy/:toyId', async (req, res) => {

    const { toyId } = req.params

    try {
        const toys = await toyService.remove(toyId)
        res.send(toys)
    } catch (err) {
        loggerService.error(err)
        res.status(500).send('Problem removing toy')
    }
})

app.post('/api/toy/', async (req, res) => {

    const toyToSave = req.body

    try {
        const toy = await toyService.save(toyToSave)
        res.send(toy)
    } catch (err) {
        loggerService.error(err)
        res.status(500).send('Problem adding toy')
    }
})

app.put('/api/toy/:toyId', async (req, res) => {
    
    const toyToSave = req.body

    try {
        const savedToy = await toyService.save(toyToSave)
        res.send(savedToy)
    } catch (err) {
        loggerService.error('Cannot update toy', err)
        res.status(400).send('Cannot update toy', err)
    }
})

app.post('/api/auth/signup', async (req, res) => {
    
    const credentials = req.body

    try {
        const user = userService.save(credentials)
        res.cookie = ('loginToken', userService.getLoginToken(user))
        res.send(user)
    } catch (err) {
        res.status(400).send('Cannot sign up', err)
    }
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(3030, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))