import Predictionary from "predictionary/src/index.mjs";
const prediction = Predictionary.instance();

prediction.addWords(["hello", "world", "foo", "bar"]);

export default prediction;
