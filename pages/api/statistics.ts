import { parseFile } from 'fast-csv'
import type { NextApiRequest, NextApiResponse } from 'next'



export default (req: NextApiRequest, res: NextApiResponse) => {

    let statistics: any = {}
    let header: any

    parseFile("./public/uploads/dataset.csv")
    .on('error', error => res.status(200).json({ error }))
    .on('data', row => {
        if (!header) {
            header = row
            header.forEach((column: string) => statistics[column] = { len: 0, keys: { }});
        }
        else {
            row.forEach((data: string, index: number) => {
                const column = header[index]
                statistics[column].len += 1
                statistics[column].keys[data] = statistics[column].keys[data] ? statistics[column].keys[data] + 1 : 1
            });
        }
    })
    .on('end', (rowCount: number) => res.status(200).json(statistics));

}