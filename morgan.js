const morgan = require('morgan')

const Morgan = morgan.token('resp', (response) => {
    return JSON.stringify(response.body)
})

module.exports = Morgan
