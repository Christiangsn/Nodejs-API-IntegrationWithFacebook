import { createConnection, getConnection, getConnectionManager, QueryRunner } from 'typeorm'
import { ConnectionNotFoundError } from './connection.error'

export class PgConnection {
  private static instance?: PgConnection
  private query?: QueryRunner

  private constructor () { }

  public static getInstance (): PgConnection {
    if (PgConnection.instance === undefined) {
      PgConnection.instance = new PgConnection()
    }
    return PgConnection.instance
  }

  public async connect (): Promise<void> {
    const connection = getConnectionManager().has('default') ? getConnection() : await createConnection()
    this.query = connection.createQueryRunner()
  }

  public async disconnect (): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await getConnection().close()
    this.query = undefined
  }
}
