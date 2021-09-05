const express = require('express')
const app = express()
const fs = require('fs')

const configJson = fs.readFileSync('./config.json', 'utf8')
const config = JSON.parse(configJson)

const port = config.port
const db = config.db_name
const user = config.db_user
const pass = config.db_pass
const option = {
    dialect: 'mariadb',
    host: config.db_host,
    port: config.db_port
}

const {init} = require('./seq/seq_v01')
const router = require('./route/router_v01')

init(db, user, pass, option)

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + "/views")

app.use(express.json())
app.use("/simple-memo", router)

app.get('/form-memo', (req, res) => {
    res.render('memo_submit.html')
})

app.listen(port, () => {
    console.log(`simple-memo start on port ${port}`)
})