const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/static'))


app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req, res) => res.sendFile((__dirname + '/static/index.html')))
app.get('/LinearRegressionOneVar', (req, res) => res.sendFile((__dirname + '/static/LinearRegressionOneVar/index.html')))
app.get('/LinearRegressionMultiVar', (req, res) => res.sendFile((__dirname + '/static/LinearRegressionMultiVar/index.html')))
app.get('/LogisticRegression', (req, res) => res.sendFile((__dirname + '/static/LogisticRegression/index.html')))
app.get('/NeuralNetwork', (req, res) => res.sendFile((__dirname + '/static/NeuralNetwork/index.html')))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


