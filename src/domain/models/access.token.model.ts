export class AccessToken {
  constructor (
    private readonly value: string
  ) {}

  public static get expirationInMs (): number {
    return 30 * 60 * 1000
  }
}
