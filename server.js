var app = require('./index')
var { expressConf } = require('./config')
const path = require('path')
const shipments = require('./controllers/shipments.controller')

app.listen(expressConf.port, expressConf.ip, function (error) {
  if (error) {
    console.log('Unable to listen for connections')
    process.exit(10)
  }
  console.log('express is listening on http://' +
    expressConf.ip + ':' + expressConf.port)
})

app.use('/api/v1/shipments', shipments)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/index.html'))
})







