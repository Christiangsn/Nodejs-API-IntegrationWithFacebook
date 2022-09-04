import { TAuthenticationError } from '@domain/entities/error'
import { AccessToken } from '@domain/entities'

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
