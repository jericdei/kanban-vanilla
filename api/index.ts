import express from 'express'
import cors from 'cors'
import db from './database'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const defaultBoard: Board['structure'] = [
    {
        column_id: 1,
        tickets: [],
    },
    {
        column_id: 2,
        tickets: [],
    },
    {
        column_id: 3,
        tickets: [],
    },
]

const insertBoard = db.prepare(
    'INSERT INTO `boards` (structure) VALUES ($structure) RETURNING id',
)

app.post('/boards', (req, res) => {
    const reqBoard = req.body() as Board

    const structure = reqBoard.structure || defaultBoard

    const boardId = insertBoard.get(JSON.stringify(structure)) as number

    res.json({
        message: 'Board created successfully.',
        board: db.query('SELECT * FROM boards WHERE id = ?').get(boardId),
    })
})
