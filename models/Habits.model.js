const { Schema, model } = require("mongoose");

const habitSchema = new Schema({
  name: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Habit = model("Habit", habitSchema);

module.exports = Habit;
