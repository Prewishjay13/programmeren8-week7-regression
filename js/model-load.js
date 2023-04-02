import { createChart, updateChart } from "../libraries/scatterplot.js";

// Neural Network: Can find complex patterns in data and works with regression
// Regression: When the neural network gives back a numeric value
let nn;

// Getting DOM elements
const memoryInputField = document.getElementById("memory-input-field");
const resoloutionInputField = document.getElementById(
  "resoloution-input-field"
);
const batteryInputField = document.getElementById("battery-input-field");
const coresInputField = document.getElementById("cores-input-field");
const predictButton = document.getElementById("prediction-btn");
const saveButton = document.getElementById("save-btn");
const resultDiv = document.getElementById("result");

// Hide the elements on the first boot
predictButton.style.display = "none";

/**
 * Fires the prediction and shows it in the viewport
 */
predictButton.addEventListener("click", (e) => {
  e.preventDefault();
  let memoryInputFieldValue =
    document.getElementById("memory-input-field").value;
  let resoloutionInputFieldValue = document.getElementById(
    "resoloution-input-field"
  ).value;
  let batteryInputFieldValue = document.getElementById("battery-input-field").value;
  let coresInputFieldValue = document.getElementById("cores-input-field").value;
  makePrediction(
    +memoryInputFieldValue,
    +resoloutionInputFieldValue,
    +batteryInputFieldValue,
    +coresInputFieldValue
  );
});

function loadData() {
  nn = ml5.neuralNetwork({
    task: "regression",
    debug: true,
  });

  /**
   * Loads in the model
   */
  const modelInfo = {
    model: "./model/model.json",
    metadata: "./model/model_meta.json",
    weights: "./model/model.weights.bin",
  };

  nn.load(modelInfo, () => console.log("Model loaded!"));

  // Show elements after loading
  predictButton.style.display = "inline-block";
}

/**
 * Creates a prediction of the price of a phone based on its specs
 */
async function makePrediction(memory, resoloution, battery, cores) {
  if (memory && resoloution && battery && cores) {
    const results = await nn.predict(
      {
        memory: memory,
        resoloution: resoloution,
        battery: battery,
        cores: cores,
      },
      () => console.log("Prediction successful!")
    );
    const priceTwoDecimals = results[0].price.toFixed(2);
    resultDiv.innerText = `The price of this phone is predicted to be arund: €${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `Please fill in everthing.`;
  }
}

loadData();
