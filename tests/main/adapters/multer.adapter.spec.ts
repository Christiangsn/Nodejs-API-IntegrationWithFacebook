import { getMockReq, getMockRes } from '@jest-mock/express'
import { RequestHandler } from 'express'
import multer from 'multer'

jest.mock('multer')

const adaptMulter: RequestHandler = (req, res, next): void => {
  const upload = multer().single('picture')
  upload(req, res, () => {

  })
}

describe('Multer Adapter', () => {
  it('Should call single upload with correct input', () => {
    const fakeMulter = multer as jest.Mocked<typeof multer>
    const uploadSpy = jest.fn()

    const singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    const multerSpy = jest.fn().mockImplementation(() => ({
      single: singleSpy
    }))
    jest.mocked(fakeMulter).mockImplementation(multerSpy)
    const req = getMockReq()
    const res = getMockRes().res
    const next = getMockRes().next
    const sut = adaptMulter

    sut(req, res, next)

    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
})
