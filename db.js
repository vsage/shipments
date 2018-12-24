const { Client } = require('pg')
const { dbConf } = require('./config')

const client = new Client(
    dbConf
)

client.connect()

module.exports = client