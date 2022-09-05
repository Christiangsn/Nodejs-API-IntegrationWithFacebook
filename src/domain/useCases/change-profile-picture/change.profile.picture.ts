import { IUUIDGenerator } from '@domain/contracts/gateways'
import { IUploadFile } from '@domain/contracts/gateways/file.storage'
import { ILoadUserProfile, ISaveUserPicture } from '@domain/contracts/repositories'
import { IProfilePicture } from '@domain/features/change-profile-picture/change.profile.picture'

export class ChangeProfilePicture implements IProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile,
    private readonly crypto: IUUIDGenerator,
    private readonly profilePicture: ISaveUserPicture & ILoadUserProfile
  ) {}

  public async save ({ file, id }: IProfilePicture.Input): Promise<IProfilePicture.Output> {
    let pictureUrl: string | undefined
    let initials: string | undefined

    if (file !== undefined) {
      pictureUrl = await this.fileStorage.upload({
        file,
        key: this.crypto.uuid({
          key: id
        })
      })
    } else {
      // Pegar o name
      const { name } = await this.profilePicture.load({ id })

      // Verificar se o nome é vazio para pegar as iniciais para concatenar
      if (name !== undefined) {
        const firstLetters = name.match(/\b(.)/g) ?? [] // Pegar iniciais de cada palavra
        // Se tiver nome e sobrenome
        if (firstLetters.length > 1) {
          initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${firstLetters.pop()?.toUpperCase() ?? ''}`
        } else { // se não pega as duas primeiras letras do nome
          initials = name.substring(0, 2)?.toUpperCase() ?? ''
        }
      }
    }

    await this.profilePicture.savePicture({ pictureUrl, initials })
  }
}
