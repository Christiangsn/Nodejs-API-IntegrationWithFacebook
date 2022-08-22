import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'motty.db.elephantsql.com',
  port: 5432,
  username: 'zxkpsdfe',
  password: 'YQYjAbCgVhAdsJn8cUcFA1hWnfVW-K3R',
  database: 'zxkpsdfe',
  entities: ['dist/infra/postgres/entities/index.js']
}
