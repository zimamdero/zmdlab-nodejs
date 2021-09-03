const express = require('express')
const app = express()
const multer = require('multer')
const fs = require('fs')
const unzipper = require('unzipper')

const configJson = fs.readFileSync('./config.json', 'utf8')
const config = JSON.parse(configJson)
const port = config.port
const pass = config.upload_pass

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/')
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})
const upload = multer({storage:storage})

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.json())

app.get('/', (req, res) => {
    log("GET /")
    res.send('Hello World!')
})

app.get('/upload/:pass', (req, res) => {
    const p = req.params.pass
    log(`GET /upload/:pass, pass = ${p}`)

    if (p !== pass) {
        log("upload-pass fail")
        res.send("upload-pass fail")
    } else {
        res.render('upload')
    }
})

app.post('/upload-file', upload.single('attachment'), (req, res) => {
    log("POST /upload-file")
    res.send(JSON.stringify(req.file))
})

app.post('/upload-files', upload.array('attachments'), (req, res) => {
    log("POST /upload-files")
    res.send(JSON.stringify(req.files))
})

app.get('/delete-file/:name', (req, res) => {
    const name = req.params.name
    const path = './public/' + name
    log(`GET /delete-file/:name, name = ${name}`)

    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            log(err)
            res.send(err)
            return
        }

        fs.unlink(path, (err) => {
            if (err) {
                log(err)
                res.send(err)
            } else {
                log(`delete - ${name}`)
                res.send(`delete - ${name}`)
            }
        })
    })
})

app.get('/delete-folder/:name', (req, res) => {
    const name = req.params.name
    const path = './public/' + name
    log(`GET /delete-folder/:name, name = ${name}`)

    fs.rmdir(path, {recursive: true},(err) => {
        if (err) {
            log(err)
            res.send(err)
        } else {
            log(`delete - ${name}`)
            res.send(`delete - ${name}`)
        }
    })
})

app.get('/unzip/:name', (req, res) => {
    const name = req.params.name
    const path = './public/' + name
    log(`GET /unzip/:name, name = ${name}`)

    fs.createReadStream(path).pipe(unzipper.Extract({path:'./public'}))

    log(`unzip - ${name}`)
    res.send(`unzip - ${name}`)
})

app.listen(port, () => {
    console.log(`weblab start - port : ${port}`)
})

function log(msg) {
    console.log(`[${new Date()}] ${msg}`)
}