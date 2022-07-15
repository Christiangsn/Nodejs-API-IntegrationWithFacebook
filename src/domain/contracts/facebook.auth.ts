import { TAuthenticationError } from '@domain/errors'
import { TAcessToken } from '@domain/models'

// Evitar colisão de nomes (interface) ao implementar o metodo
namespace IFacebookAuth {
  export type Params = {
    token: string
  }

  export type Return = TAcessToken | TAuthenticationError
}

export interface IFacebookAuth {
  execute: ({ token }: IFacebookAuth.Params) => Promise<IFacebookAuth.Return>
}
