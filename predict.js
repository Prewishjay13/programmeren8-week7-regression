const nn = ml5.neuralNetwork({ task: 'regression', debug: true })

let minMemory = 4000
let maxMemory = 0
let minPrice = 4000
let maxPrice = 0
let minBattery = 4000
let maxBattery= 0

let fieldMemory = document.getElementById('fieldMemory')
let fieldPrice = document.getElementById('fieldPrice')
let fieldBattery = document.getElementById('fieldBattery')

nn.load('./model/model.json', modelLoaded)

function modelLoaded () {
    Papa.parse("../training-side/data/mobilephones.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => processData(results.data)
    })
}
function processData(data) {
    for (let phone of data) {
        if (phone.memory < minMemory && phone.memory !== 0) {
            minMemory = phone.memory
        }
        if (phone.memory > maxMemory) {
            maxMemory = phone.memory
        }

        if (phone.price < minPrice && phone.price !== 0) {
            minPrice = phone.price
        }
        if (phone.price > maxPrice) {
            maxPrice = phone.price
        }

        if (phone.battery < minBattery && phone.battery !== 0) {
            minBattery = phone.battery
        }
        if (phone.battery > maxBattery) {
            maxBattery = phone.battery
        }
    }

    fieldMemory.min = minMemory
    fieldMemory.max = maxMemory

    fieldPrice.min = minPrice
    fieldPrice.max = maxPrice

    fieldBattery.min = minBattery
    fieldBattery.max = maxBattery
}

async function makePrediction() {
    let valuePrice = parseInt(fieldPrice.value)
    let valueMemory = parseInt(fieldMemory.value)
    let valueBattery = parseInt(fieldBattery.value)

    const results = await nn.predict({ memory: valueMemory, price: valuePrice, battery: valueBattery })

    document.getElementById('result').innerHTML = `Geschatte opslag: ${results[0].storage}`
}

document.getElementById('predictionButton').addEventListener('click', makePrediction)

