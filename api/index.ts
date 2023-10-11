import express from 'express'
import cors from 'cors'
import db from './database'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const defaultBoard: Board = {
    title: "Default Board",
    structure: [
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
}

const insertBoard = db.prepare(
    'INSERT INTO boards (title, structure) VALUES ($title, $structure) RETURNING id',
)

app.get('/boards', (req, res) => {
    const boards = db.query('SELECT * FROM boards').all() as Board[]

    res.send({
        boards: boards.map((board: Board) => ({
            id: board.id,
            title: board.title,
            structure: JSON.parse(board.structure as any)
        }))
    })
})

app.post('/boards', (req, res) => {
    let board = {
        title: req.body.title,
        structure: req.body.structure
    } as Board

    if (!board.title) board.title = defaultBoard.title
    if (!board.structure) board.structure = defaultBoard.structure

    const boardId = insertBoard.get({
        $title: board.title,
        $structure: JSON.stringify(board.structure)
    }) as any

    res.send({
        message: 'Board created successfully.',
        board: db.query('SELECT * FROM boards WHERE id = ?').get(boardId.id),
    })
})

app.listen(3000, () => {
    console.log('Listening on http://localhost:3000')
})