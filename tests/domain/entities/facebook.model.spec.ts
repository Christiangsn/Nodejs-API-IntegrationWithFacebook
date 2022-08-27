import { FacebookAccount } from '@domain/entities/facebook.entity'

describe('FacebookAccount', () => {
  it('Should create with facebook data only', () => {
    const sut = new FacebookAccount({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })

    expect(sut).toEqual({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
  })

  it('Should update name if its empty', () => {
    const sut = new FacebookAccount({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    }, {
      id: 'any_id'
    })

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
  })

  it('Should not updated name if its not empty', () => {
    const sut = new FacebookAccount({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    }, {
      id: 'any_id',
      name: 'any_name'
    })

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
  })
})
