import { utilService } from "./util.service.js"

let toys
utilService.readJSONFile('./data/toys.json')
    .then(data => toys = data)


export const toyService = {
    query,
    get,
    remove,
}

function get(toyId){
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId){
    const toyIdx = toys.findIndex(toy => toy._id === toyId)
    if(toyIdx < 0) return Promise.reject(`Cannot find toy with id ${toyId}`)
    toys.splice(toyIdx, 1)
    return _saveToFile().then(() => toys)
}

function query(){
    return Promise.resolve(structuredClone(toys))
}

function _saveToFile(){
    return utilService.writeToJSONFile('./data/toys.json', toys)
}