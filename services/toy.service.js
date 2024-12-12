import { utilService } from "./util.service.js"

let toys
utilService.readJSONFile('./data/toys.json')
    .then(data => toys = data)
    .then(data => console.log(typeof(data)))


export const toyService = {
    query,
    get,
}

function get(toyId){
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function query(){
    return Promise.resolve(structuredClone(toys))
}