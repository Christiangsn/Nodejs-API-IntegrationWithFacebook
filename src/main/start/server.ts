
import { env } from '../config/env'
import { createConnection, getConnectionOptions } from 'typeorm'

getConnectionOptions()
  .then(async options => {
    const root = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'
    const entities = [`${root}/infra/postgres/entities/index.{js,ts}`]
    await createConnection({ ...options, entities })
    const { app } = await import('./app')

    app.listen(env.appPort, () => console.log(`Server running at http://localhost:${env.appPort}`))
  }).catch((err) => console.error(err))
