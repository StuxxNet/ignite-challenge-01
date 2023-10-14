import fs, { read } from 'fs';
import { parse } from 'csv-parse';

export class ReadFromCSV {
    #csvPath = new URL('./tasks.csv', import.meta.url)

    read() {
        const parser = parse({columns: true, delimiter: ','}, (error, data) => {
            for (const [key, value] of Object.entries(data)){
                const { title, description } = value

                const task = {
                    title,
                    description
                }

                fetch('http://localhost:3000/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(task),
                    duplex: 'half'
                })
            }
        })
        
        fs.createReadStream(this.#csvPath).pipe(parser)
    }
}

const readCsv = new ReadFromCSV()
readCsv.read()