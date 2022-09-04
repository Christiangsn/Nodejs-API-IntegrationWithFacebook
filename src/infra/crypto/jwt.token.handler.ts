import { ITokenGeneration, ITokenValidator } from '@domain/contracts/crypto'

import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements ITokenGeneration, ITokenValidator {
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

  public async validate ({ token }: ITokenValidator.Params): Promise<ITokenValidator.Return> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
