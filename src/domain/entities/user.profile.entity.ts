export class UserProfile {
  public initials?: string
  public pictureUrl?: string

  constructor (readonly id: string) { }

  public setPicture ({ pictureUrl, name }: { pictureUrl?: string, name?: string}): void {
    this.pictureUrl = pictureUrl

    // Verificar se o nome é vazio para pegar as iniciais para concatenar
    if (pictureUrl === undefined && name !== undefined) {
      const firstLetters = name.match(/\b(.)/g) ?? [] // Pegar iniciais de cada palavra
      // Se tiver nome e sobrenome
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${firstLetters.pop()?.toUpperCase() ?? ''}`
      } else { // se não pega as duas primeiras letras do nome
        this.initials = name.substring(0, 2)?.toUpperCase() ?? ''
      }
    }
  }
}
