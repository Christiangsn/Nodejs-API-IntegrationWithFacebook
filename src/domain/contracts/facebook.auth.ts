import { TAuthenticationError } from '@domain/error'
import { TAcessToken } from '@domain/models'

// Evitar colisão de nomes (interface) ao implementar o metodo
export namespace IFacebookAuth {
  export type Params = {
    token: string
  }

  export type Return = TAcessToken | TAuthenticationError
}

export interface IFacebookAuth {
  execute: ({ token }: IFacebookAuth.Params) => Promise<IFacebookAuth.Return>
}
