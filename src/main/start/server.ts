
import { app } from './app'
import { env } from '../config/env'
import { createConnection } from 'typeorm'

createConnection()
  .then(() => {
    app.listen(env.appPort, () => console.log(`Server running at http://localhost:${env.appPort}`))
  }).catch(console.error)
