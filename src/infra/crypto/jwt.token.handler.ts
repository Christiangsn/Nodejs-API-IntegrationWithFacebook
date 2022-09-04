import { ITokenGeneration } from '@domain/contracts/crypto'

import { sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements ITokenGeneration {
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

  public async validate ({ token }: { token: string}): Promise<void> {
    verify(token, this.secret)
  }
}
