type TFacebookAccountModelData = { id?: string, name?: string }
type TFacebookModelData = { name: string, email: string, facebookId: string, id?: string}

export class FacebookAccount {
  public id?: string
  public name: string
  public email: string
  public facebookId: string

  // O modelo recebe o modelo de dado do facebook e o os dados do banco de dados referente ao email...
  constructor (modelFacebook: TFacebookModelData, model?: TFacebookAccountModelData) {
    this.id = model?.id
    this.name = model?.name ?? modelFacebook.name
    this.email = modelFacebook.email
    this.facebookId = modelFacebook.facebookId
  }
}
