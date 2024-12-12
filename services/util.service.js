import fs from 'fs'

export const utilService = {
    readJSONFile,
    writeToJSONFile,
    makeId,
}

function readJSONFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err)
            else resolve(JSON.parse(data))
        })
    })
}

function writeToJSONFile(path, data) {
    return new Promise((resolve, reject) => {
        data = JSON.stringify(data, null, 4)
        fs.writeFile(path, data, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

function makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}