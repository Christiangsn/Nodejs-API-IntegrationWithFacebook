import { UserProfile } from '@domain/entities'

describe('FacebookAccount', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  it('Should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('Should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('Should create initials with two letters of first names', () => {
    sut.setPicture({ name: 'Christian Guimaraes do Santos' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'CS'
    })
  })

  it('Should create initials with first latter name', () => {
    sut.setPicture({ name: 'Christian' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'CH'
    })
  })

  it('Should with empty initials when name and picture url are not provided', () => {
    sut.setPicture({})

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
