import fs, { read } from 'fs';
import { parse } from 'csv-parse';

export class ReadFromCSV {
    #csvPath = new URL('../tasks.csv', import.meta.url)

    read() {
        const parser = parse({delimiter: ','}, (error, data) => {
            for (const [key, value] of Object.entries(data)){
                if (key > 0) {

                    const task = {
                        title: value[0],
                        description: value[1]
                    }

                    fetch('http://localhost:3000/tasks', {
                        method: 'POST',
                        body: JSON.stringify(task),
                        duplex: 'half'
                    })
                }
            }
        })
        
        fs.createReadStream(this.#csvPath).pipe(parser)
    }
}

const readCsv = new ReadFromCSV()
readCsv.read()