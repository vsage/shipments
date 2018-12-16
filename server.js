
var app = require('./index')
var config = require('./config')
const path = require('path')
const examples = require('./lib/examples')


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/index.html'))
})

app.listen(config.express.port, config.express.ip, function (error) {
  if (error) {
    console.log('Unable to listen for connections')
    process.exit(10)
  }
  console.log('express is listening on http://' +
    config.express.ip + ':' + config.express.port)
})






