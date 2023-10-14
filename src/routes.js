import { UrlParser } from './utils/url-parser.js'
import { Database } from './middlewares/database.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: '/tasks',
        handler: (req, res) => {
            const { search } = req.queryParams

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            if(tasks.length > 0) {
                return res
                    .setHeader('Content-Type', 'application/json')
                    .writeHead(200)
                    .end(JSON.stringify(tasks))
            }

            return res
                .setHeader('Content-Type', 'application/json')
                .writeHead(404)
                .end(JSON.stringify({
                    error: 'Task não encontrada ou banco de dados vazio'
                }))
        }
    },
    {
        method: 'POST',
        path: '/tasks',
        handler: (req, res) => {
            const id = randomUUID()

            database.insert('tasks', {
                id: id, 
                created_at: new Date(),
                updated_at: null,
                completed_at: null,
                ...req.body
            })
            return res
                .writeHead(201)
                .end()
        }
    },
    {
        method: 'PUT',
        path: '/tasks/:id',
        handler: (req, res) => {
            const id = req.params.id
            database.update('tasks', id, req.body)
            return res
                .writeHead(204)
                .end()
        }
    },
    {
        method: 'PATCH',
        path: '/tasks/:id/complete',
        handler: (req, res) => {
            const id = req.params.id
            database.patch('tasks', id)
            return res
                .writeHead(204)
                .end()
        }
    },
    {
        method: 'DELETE',
        path: '/tasks/:id',
        handler: (req, res) => {
            const id = req.params.id
            database.delete('tasks', id)
            return res
                .writeHead(200)
                .end()
        }
    }
]