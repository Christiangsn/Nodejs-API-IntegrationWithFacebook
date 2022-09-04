module.exports = {
  type: process.env.TYPEORM_PORT,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATA_BASE,
  entities: [process.env.TYPEORM_ENTITIES]
}
