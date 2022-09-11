import { MaxFileSize } from '@app/validators/required/max-file-size'
import { AllowedMimeTypes, Required, RequiredBuffer, RequiredString, ValidationBuilder } from '@app/validators'

describe('ValidationBuilder', () => {
  it('Should return a RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value')])
  })

  it('Should return RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: buffer })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })

  it('Should return Required', () => {
    const obj = { any: 'any' }
    const validators = ValidationBuilder
      .of({ value: obj })
      .required()
      .build()

    expect(validators).toEqual([new Required(obj)]
    )
  })

  it('Should return Required', () => {
    const buffer = Buffer.from('any_buffer')

    const obj = { buffer }
    const validators = ValidationBuilder
      .of({ value: obj })
      .required()
      .build()

    expect(validators).toEqual([
      new Required(obj),
      new RequiredBuffer(buffer)
    ])
  })

  it('Should return correct image validators ', () => {
    const buffer = Buffer.from('any_buffer')

    const obj = { buffer }
    const validators = ValidationBuilder
      .of({ value: obj })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([new MaxFileSize(5, buffer)])
  })

  it('Should return correct image validators ', () => {
    const obj = { mimeType: 'image/png' }
    const validators = ValidationBuilder
      .of({ value: obj })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  it('Should return correct image validators ', () => {
    const buffer = Buffer.from('any_buffer')
    const obj = { mimeType: 'image/png', buffer }
    const validators = ValidationBuilder
      .of({ value: obj })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png'), new MaxFileSize(6, buffer)])
  })
})
