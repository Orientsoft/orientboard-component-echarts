const fs = require('fs-extra')
  , path = require('path')

const pkg = fs.readJsonSync(path.join(__dirname, 'package.json'))

module.exports = [
  { type: pkg.orientboard.name
  , h: 400
  , w: 500
  , x: 0
  , y: 0
  , rotate: 0
  , data: {

    }
  }
]
