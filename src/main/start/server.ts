import '../config/module-alias'
import 'reflect-metadata'

import { app } from './app'
import { env } from '../config/env'

app.listen(env.appPort, () => console.log(`Server running at http://localhost:${env.appPort}`))
