import { utilService } from "./util.service.js"
import Cryptr from "cryptr"

const cryptr = new Cryptr(process.env.SECRET1 || 'bugs-bunny')

let users
utilService.readJSONFile('./data/users.json')
    .then(data => users = data)

export const userService = {
    save,
    getLoginToken
}

async function save(user){
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        password: user.password,
    }

    if(user._id){
        users = users.map(user => user._id === userToSave._id ? userToSave : user)
    } else {
        userToSave._id = utilService.makeId()
        users.unshift(userToSave)
    }

    try {
        await _saveToFile()
        return {
            _id: userToSave._id,
            fullname: userToSave.fullname,
        }
    } catch (err) {
        loggerService.error('problem signing up')
        throw new Error('problem signing up')
    }
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function _saveToFile(){
    return utilService.writeToJSONFile('./data/users.json', users)
}