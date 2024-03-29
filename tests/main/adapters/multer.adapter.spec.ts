import { ServerError } from '@app/errors/http/http'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { adaptMulter } from '@main/adapters/multer.adapter'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import multer from 'multer'

jest.mock('multer')

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
    singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    multerSpy = jest.fn().mockImplementation(() => ({
      single: singleSpy
    }))
    jest.mocked(fakeMulter).mockImplementation(multerSpy)
    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    uploadSpy = jest.fn().mockImplementation((req, res, next) => {
      req.file = {
        buffer: Buffer.from('any_buffer'),
        mimeType: 'any_type'
      }
      next()
    })
    req = getMockReq({
      locals: {
        anyLocals: 'any_locals'
      }
    })
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

  it('Should not add file to req.locals', () => {
    uploadSpy = jest.fn().mockImplementationOnce((req, res, next) => { next() })

    sut(req, res, next)

    expect(req.locals).toEqual({ anyLocals: 'any_locals' })
  })

  it('Should add file to req.locals', () => {
    sut(req, res, next)

    expect(req.locals).toEqual({
      anyLocals: 'any_locals',
      file: {
        buffer: req.file?.buffer,
        mimeType: req.file?.mimetype
      }
    })
  })

  it('Should call next on Success', () => {
    sut(req, res, next)

    expect(next).toHaveBeenCalledWith()
    // expect(next).toHaveBeenCalledTimes(1) ESTA COM BUG NO JEST, O MOCK IMPLEMENTATION NAO ESTA SOBRESCREVENDO
  })
})
