import { ITokenGeneration } from '@data/contracts/crypto'

import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator implements ITokenGeneration {
  constructor (
    private readonly secret: string
  ) { }

  public async generation ({ key, expirationInMs }: ITokenGeneration.Params): Promise<ITokenGeneration.Return> {
    const expirationInSeconds = expirationInMs / 1000
    const generationToken = sign({
      key
    }, this.secret, { expiresIn: expirationInSeconds })

    return generationToken
  }
}
