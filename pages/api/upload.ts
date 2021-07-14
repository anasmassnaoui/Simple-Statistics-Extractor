// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import nextConnect from 'next-connect'

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, "dataset.csv")
  })
})

const apiRoute = nextConnect({
  onError(error, _, res: NextApiResponse) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  }
})

apiRoute.use(upload.single('file'))

apiRoute.post((
  _,
  res: NextApiResponse
) => {
  res.status(200).json({ status: 'success' })
})

export default apiRoute

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};