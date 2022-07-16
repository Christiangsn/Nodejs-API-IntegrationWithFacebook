import { TAuthenticationError } from '@domain/error'
import { AccessToken } from '@domain/models'

// Evitar colisão de nomes (interface) ao implementar o metodo
export namespace IFacebookAuth {
  export type Params = {
    token: string
  }

  export type Return = AccessToken | TAuthenticationError
}

export interface IFacebookAuth {
  execute: ({ token }: IFacebookAuth.Params) => Promise<IFacebookAuth.Return>
}
