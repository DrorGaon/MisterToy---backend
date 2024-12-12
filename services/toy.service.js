import { utilService } from "./util.service.js"

let toys
utilService.readJSONFile('./data/toys.json')
    .then(data => toys = data)


export const toyService = {
    query,
}

function query(){
    return Promise.resolve(structuredClone(toys))
}