module.exports.expressConf = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '127.0.0.1'
}

module.exports.dbConf = {
  user: 'postgres',
  host: '127.0.0.1',
  database: 'glexport_development',
  password: '',
  port: 5432,
}

