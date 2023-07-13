const { Schema, model } = require("mongoose");

const habitSchema = new Schema({
  name: String,
});

const Habit = model("Habit", habitSchema);

module.exports = Habit;
