import { IMemoryDb, newDb } from 'pg-mem'
import { Connection } from 'typeorm'

// Arquivo reaproveital para conexão do banco em memória
export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection: Connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts'] // Caso for repassado uma entidade ele procurar ela, caso contrário pegar todas a entidades do index da pasta entites
  })
  await connection.synchronize()
  return db
}
