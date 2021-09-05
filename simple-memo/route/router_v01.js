const express = require('express')
const router = express.Router()
const seq_v01 = require('../seq/seq_v01')

router.use(function timeLog(req, res, next) {
    console.log(`[${new Date()}] ${req.baseUrl + req.path} ${req.method}`)
    next()
})

router.get('/', (req, res) => {
    res.send('simple-memo')
})

router.post('/add-memo', (req, res) => {
    seq_v01.addMemo(req.body, (result) => {res.send(result)}).then()
})

router.put('/edit-memo/:id', (req, res) => {
    seq_v01.editMemo(req.params.id, req.body, (result) => {res.send(result)}).then()
})

router.delete('/delete-memo/:id', (req, res) => {
    seq_v01.deleteMemo(req.params.id, (result) => {res.send(result)}).then()
})

router.get('/list-memo', (req, res) => {
    let page = 0
    if (req.query.hasOwnProperty('page')) page = req.query.page
    if (page < 0) page = 0
    let limit = 0
    if (req.query.hasOwnProperty('limit')) limit = req.query.limit
    if (limit < 0) limit = 0
    seq_v01.getMemoList(page, limit, (result) => {res.send(result)}).then()
})

router.get('/search-memo/:txt', (req, res) => {
    seq_v01.searchMemoList(req.params.txt, (result) => {res.send(result)}).then()
})

router.get('/memo/:id', (req, res) => {
    seq_v01.getMemo(req.params.id, (result) => {res.send(result)}).then()
})

module.exports = router