const DataStore = require("nedb-promises")
const dateFormat = require("dateformat")
const userDB = DataStore.create({filename: 'dataUsers.db', autoload: true})
const postDB = DataStore.create({filename: 'dataPosts.db', autoload: true})
const otherDB = DataStore.create({filename: 'dataOther.db', autoload: true})

class Post {
    id;
    title;
    date;
    userInfo;
    status

    async fromDataBase(sqlObj) {
        const {_id, title, date, userId, status} = sqlObj
        const userInfo = await Data.getUserById(userId)
        Object.assign(this, {
            id: _id, title, date: new Date(date), userInfo, status
        })
    }

    toSqlObj() {
        const {id, title, date, userInfo, status} = this
        return {_id: id, title, status, date: date.getTime(), userId: userInfo.id}
    }

    toJsonObj() {
        const date = dateFormat(this.date, "mm-dd HH:MM")
        let name = this.userInfo
        name[1]='*'
        return {key: this.id, title: this.title, date, name: this.userInfo.name}
    }
}

class User {
    id;
    openId;
    name;
    cardId;
    status;

    fromDataBase(sqlObj) {
        const {_id, openId, name, cardId,status} = sqlObj
        Object.assign(this, {
            id: _id, openId, name, cardId,status
        })
    }

    toSqlObj() {
        const {id, openId, name, cardId, status} = this
        return {_id:id, openId, name, cardId, status}
    }

    toJsonObj() {
        const {name, cardId, status} = this
        return {cardId,name,status}
    }
}

const Data = {
    User,Post,
    getPosts(page) {
        const perPage = 10
        return postDB.find({}).sort({date: -1}).skip((page - 1) * perPage).limit(perPage).exec().then(docs => (
            (docs || []).map(value => new Post().fromDataBase(value))
        ))
    },
    insertOrUpdatePost(post) {
        return postDB.insert(post.toSqlObj()).then(value => new Post().fromDataBase(value))
    },
    getUserById(id) {
        return userDB.findOne({_id: id}).then(value => value && new User().fromDataBase(value))
    },
    getUserByOpenId(openId) {
        return userDB.findOne({openId}).then(value => value && new User().fromDataBase(value))
    },
    getUserByCardId(cardId) {
        return userDB.findOne({cardId}).then(value => value && new User().fromDataBase(value))
    },
    createUser(user) {
        return userDB.insert(user.toSqlObj()).then(value => value && new User().fromDataBase(value))
    }
}

module.exports = Data
