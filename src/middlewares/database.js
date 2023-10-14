import fs from 'node:fs/promises'

export class Database {
    #database = {}
    #databasePath = new URL('../db.json', import.meta.url)

    constructor(){
        fs.readFile(this.#databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persistData()
            })
    }

    #persistData(){
        fs.writeFile(this.#databasePath, JSON.stringify(this.#database))
    }
    
    select(table, search) {

        let data = this.#database[table] ?? []

        if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        
        return data
    }

    insert(table, data) {

        data.updated_at = null
        data.completed_at = null

        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        
        this.#persistData()
    }

    update(table, id, data) {
        const rowNumber = this.#database[table].findIndex(row => { return row.id == id })
        
        if (rowNumber > -1) {
            this.#database[table][rowNumber].title = data.title ? data.title : this.#database[table][rowNumber].title 
            this.#database[table][rowNumber].description = data.description ? data.description : this.#database[table][rowNumber].description
            this.#database[table][rowNumber].updated_at = new Date()
            this.#persistData()
        }
    }

    patch(table, id) {
        const rowNumber = this.#database[table].findIndex(row => { return row.id == id })

        if (rowNumber > -1){
            this.#database[table][rowNumber].updated_at = new Date()
            this.#database[table][rowNumber].completed_at = new Date()
            this.#persistData()
        }
    }

    delete(table, id) {
        const rowNumber = this.#database[table].findIndex(row => { return row.id == id })

        if (rowNumber > -1) {
            this.#database[table].splice(rowNumber, 1)
            this.#persistData()
        }
    }
}