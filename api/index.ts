import express from 'express'
import cors from 'cors'
import db from './database'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const insertBoard = db.prepare(
    'INSERT INTO `boards` (structure) VALUES ($structure) RETURNING id',
)

app.post('/boards', (req, res) => {
    const reqBoard = req.body() as Board

    if (!reqBoard.structure) {
        res.status(422).send({
            message: 'Structure is required.',
        })
    }

    db.transaction(() => {
        insertBoard.get(JSON.stringify(reqBoard.structure))
    })

    res.json({})
})
