import { ServerError } from '@app/errors/http/http'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import multer from 'multer'

jest.mock('multer')

const adaptMulter: RequestHandler = (req, res, next): void => {
  const upload = multer().single('picture')
  upload(req, res, (err) => {
    res.status(500).json({ error: new ServerError(err).message })
  })
}

describe('Multer Adapter', () => {
  let fakeMulter: jest.Mocked<typeof multer>
  let uploadSpy: jest.Mock
  let singleSpy: jest.Mock
  let multerSpy: jest.Mock
  let req: Request
  let res: Response
  let next: NextFunction
  let sut: RequestHandler

  beforeAll(() => {
    fakeMulter = multer as jest.Mocked<typeof multer>
    uploadSpy = jest.fn().mockImplementation(() => {})
    singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    multerSpy = jest.fn().mockImplementation(() => ({
      single: singleSpy
    }))
    jest.mocked(fakeMulter).mockImplementation(multerSpy)
    req = getMockReq()
    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    sut = adaptMulter
  })

  it('Should call single upload with correct input', () => {
    sut(req, res, next)

    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return 500 if upload fails', () => {
    const error = new Error('multer Error')
    uploadSpy = jest.fn().mockImplementationOnce((req, res, next) => { next(error) })

    sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      error: new ServerError(error).message
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
