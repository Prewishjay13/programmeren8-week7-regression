import { createChart, updateChart } from "./libraries/scatterplot.js"

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })

let min = 0
let max = 0

let field = document.getElementById('field')

function loadData() {
    Papa.parse("./data/mobilephones.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => chartData(results.data)
    })
}

function chartData(data) {
    const chartdata = data.map(phone => ({
        x: phone.storage,
        y: phone.memory,
    }))

    // chartjs aanmaken
    createChart(chartdata, "storage", "memory")

    // shuffle
    data.sort(() => (Math.random() - 0.5))

    // een voor een de data toevoegen aan het neural network
    for (let phone of data) {
        nn.addData({ memory: phone.memory }, { storage: phone.storage })
        if (phone.memory < min && min !== 0) {
            min = phone.memory
        }
        if (phone.memory > max) {
            max = phone.memory
        }

    }

    field.min = min
    field.max = max

    // normalize
    nn.normalizeData()

    startTraining()
}

function startTraining() {
    nn.train({ epochs: 20 }, () => finishedTraining()) 
}

async function finishedTraining(){
    console.log("Finished training!")

    let predictions = []
    for (let mem = min; mem < max; mem += 2) {
        const pred = await nn.predict({memory: mem})
        predictions.push({x: pred[0].storage, y: mem})
    }
    updateChart("Predictions", predictions)
}

async function makePrediction() {
    let value = parseInt(field.value)
    const results = await nn.predict({ memory: value })
    console.log(`Geschatte opslag: ${results[0].storage}`)
    document.getElementById('result').innerHTML = `Geschatte opslag: ${results[0].storage}`
}

document.getElementById('predictionButton').addEventListener('click', makePrediction)

document.getElementById('downloadButton').addEventListener('click', () => {
    nn.save()
})

loadData()

