import Predictionary from "predictionary/src/index.mjs";
const prediction = Predictionary.instance();

const topWords = require("./assets/topWords.json");

prediction.addWords(topWords);

export default prediction;
