import { ServerError } from '@app/errors'
import { RequestHandler } from 'express'
import multer from 'multer'

export const adaptMulter: RequestHandler = (req, res, next): void => {
  const upload = multer().single('picture')
  upload(req, res, (err) => {
    if (err !== undefined) {
      return res.status(500).json({ error: new ServerError(err).message })
    }
    if (req.file !== undefined) {
      req.locals = {
        ...req.locals,
        file: {
          buffer: req.file.buffer,
          mimeType: req.file.mimetype
        }
      }
    }

    return next()
  })
}
