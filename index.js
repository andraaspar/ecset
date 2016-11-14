let express = require('express')
let app = express()

app.use(express.static('build'))

app.listen(8080, function () {
	console.log('Listening on port 8080.')
})
