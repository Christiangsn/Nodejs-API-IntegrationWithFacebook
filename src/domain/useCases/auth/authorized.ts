import { ITokenValidator } from '@domain/contracts/crypto'
import { IAuthorize } from '@domain/features/auth'

export class AuthorizedByToken implements IAuthorize {
  constructor (
    private readonly cryptography: ITokenValidator
  ) { }

  public async auth (params: { token: string }): Promise<string> {
    const key = await this.cryptography.validate({ token: params.token })
    return key
  }
}
