import { parseFile } from 'fast-csv'
import type { NextApiRequest, NextApiResponse } from 'next'

const Student_ID_Column = 0
const Semster_Name_Column = 1
const Paper_ID_Column = 2
const Paper_Name_Column = 3
const Marks_Column = 4


export default (req: NextApiRequest, res: NextApiResponse) => {

    let _statistics: any = {
        semsters: {},
        marks: {}
    }
    let header: any
    parseFile("./public/uploads/dataset.csv")
    .on('error', error => {
        console.log(error)
        res.status(200).json({ error })
    })
    .on('data', row => {
        if (!header) header = row
        else {
            const Student_ID = row[Student_ID_Column]
            const Semster_Name = row[Semster_Name_Column]
            const Paper_ID = row[Paper_ID_Column]
            const Paper_Name = row[Paper_Name_Column]
            //const Marks = Math.floor(Math.random() * 100)
            const Marks = parseInt(row[Marks_Column])

            if (!_statistics.semsters[Semster_Name])
                _statistics.semsters[Semster_Name] = { analyse: {}, marks: {} }
            
                
            const { notes=0, count=0, min=100, max=0 } = _statistics.semsters[Semster_Name].analyse 
            
            _statistics.semsters[Semster_Name].analyse = {
                notes: notes + Marks,
                count: count + 1,
                min: min > Marks ? Marks : min,
                max: max < Marks ? Marks : max
            }
            if (!_statistics.semsters[Semster_Name].marks[Marks])
                _statistics.semsters[Semster_Name].marks[Marks] = 0
            if (!_statistics.marks[Marks])
                _statistics.marks[Marks] = 0
            _statistics.semsters[Semster_Name].marks[Marks] += 1
            _statistics.marks[Marks] += 1
        }
    })
    .on('end', (rowCount: number) => {
        let statistics: any = {
            Semsters: {
                analyse: [],
                marks: {}
            }
        }
        Object.keys(_statistics.semsters).forEach((key, index) => {
            const { analyse } = statistics['Semsters']
            const { notes, count, min, max } = _statistics.semsters[key].analyse
            statistics['Semsters'].analyse = [...analyse, {
                name: key,
                moyenne: notes / count,
                min,
                max
            }]
            statistics['Semsters'].marks[key] = Object.keys(_statistics.semsters[key].marks).map(_key => ({
                mark: parseInt(_key),
                count: _statistics.semsters[key].marks[_key],
                index: index + 1,
            }))

        })

        statistics.marks = Object.keys(_statistics.marks).map(key => ({
            name: parseInt(key),
            count: _statistics.marks[key]
        }))

        res.status(200).json(statistics)
    });

}