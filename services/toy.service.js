import { utilService } from "./util.service.js"

let toys
utilService.readJSONFile('./data/toys.json')
    .then(data => toys = data)

export const toyService = {
    query,
    get,
    remove,
    save,
}

function query( filterBy ){
    let filteredToys = structuredClone(toys)
    if(filterBy.name){
        const regExp = new RegExp(filterBy.name, 'i')
        filteredToys = filteredToys.filter(toy => regExp.test(toy.name))
    }
    if(filterBy.price){
        filteredToys = filteredToys.filter(toy => toy.price >= filterBy.price)
    }
    return Promise.resolve(structuredClone(filteredToys))
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

function save(toyToSave){
        
    toyToSave = {
        _id: toyToSave._id,
        name: toyToSave.name,
        price: toyToSave.price,
        labels: toyToSave.labels,
        inStock: toyToSave.inStock,
    }

    if(toyToSave._id){
        const toyIdx = toys.findIndex(toy => toy._id === toyToSave._id)
        toys.splice(toyIdx, 1, toyToSave)
    } else {
        toyToSave._id = utilService.makeId()
        toys.unshift(toyToSave)
    }

    return _saveToFile().then(() => toyToSave)
}

function _saveToFile(){
    return utilService.writeToJSONFile('./data/toys.json', toys)
}