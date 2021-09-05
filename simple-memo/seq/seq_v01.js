const {Sequelize, Model, DataTypes, Op} = require('sequelize')

class Memo extends Model {}

class Folder extends Model {}

class Position extends Model {}

let sequelize = null

module.exports.init = function (db, user, pass, option) {
    sequelize = new Sequelize(db, user, pass, option)

    Memo.init({
        contents: DataTypes.STRING,
        m_type: {
            type: DataTypes.ENUM('normal', 'timecheck'),
            defaultValue: 'normal'
        }
    }, {sequelize, modelName: 'memo',
        timestamps: true, paranoid: true, underscored: true})

    Folder.init({
        name: DataTypes.STRING,
        description: DataTypes.STRING
    }, {sequelize, modelName: 'folder',
        timestamps: true, paranoid: true, underscored: true})

    Position.init({
        target_id: DataTypes.INTEGER,
        target_type: {
            type: DataTypes.ENUM('memo', 'folder'),
            defaultValue: 'memo'
        },
        parent_id: DataTypes.INTEGER,
        path: DataTypes.STRING
    }, {sequelize, modelName: 'position',
        timestamps: true, paranoid: true, underscored: true});

    (async () => {
        await sequelize.sync()
    })()
}

module.exports.addMemo = async function (json, callback) {
    let type = "normal"
    if (json.hasOwnProperty('type'))type = json.type
    await Memo.create({
        contents: json.contents,
        m_type: type
    }).then(function (memo) {
        sendResult(callback, memo)
    }).catch(function (err) {
        sendResult(callback, err)
    })
}

module.exports.getMemo = async function (id, callback) {
    await Memo.findByPk(id).then(function (memo) {
        sendResult(callback, memo)
    }).catch(function (err) {
        sendResult(callback, err)
    })
}

module.exports.searchMemoList = async function (txt, callback) {
    await Memo.findAll({
        where:{
            contents:{
                [Op.like]: "%" + txt + "%"
            }
        }
    }).then(function (memos) {
        sendResult(callback, memos)
    }).catch(function (err) {
        sendResult(callback, err)
    })
}

module.exports.getMemoList = async function (page, limit, callback) {
    const offset = limit * (page - 1)
    if (limit < 1) limit = 1000
    await Memo.findAll({
        offset: offset,
        limit: limit
    }).then(function (memos) {
        sendResult(callback, memos)
    }).catch(function (err) {
        sendResult(callback, err)
    })
}

module.exports.editMemo = async function (id, json, callback) {
    await Memo.findByPk(id).then(function (memo) {
        if (memo === null) {
            sendResult(callback, "Not found!")
        } else {
            let contents = memo.contents
            if (json.hasOwnProperty('contents'))contents = json.contents
            memo.contents = contents
            (async () => {
                memo.save().then(function (memo) {
                    sendResult(callback, memo)
                }).catch(function (err) {
                    sendResult(callback, err)
                })
            })()
        }
    }).catch(function (err) {
        sendResult(callback, err)
    })
}

module.exports.deleteMemo = async function(id, callback) {
    await Memo.findByPk(id).then(function (memo) {
        if (memo === null) {
            sendResult(callback, "Not found!")
        } else {
            (async () => {
                await memo.destroy().then(function () {
                    sendResult(callback, "deleted memo id : " + id)
                }).catch(function (err) {
                    sendResult(callback, err)
                })
            })()
        }
    }).catch(function (err) {
        sendResult(callback, err)
    })
}

function sendResult(callback, result) {
    console.log(result)
    callback(result)
}