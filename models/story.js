const { model, Schema } = require("mongoose");

const data = new Schema({
  story: String,
});

module.exports = new model("story", data);
