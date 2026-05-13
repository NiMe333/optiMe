const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  username: { type: String, required: false }, //What should the application call you?
  education: { type: String, required: false },
  employment: { type: String, required: false },
  mood: { type: Number, required: false },
  sleepHours: { type: String, required: false },
  activity: { type: String, required: false },
  socialConnection: { type: Number, required: false },
  phoneScreenTime: { type: String, required: false },
  stress: { type: String, required: false },
  formFinished: { type: Boolean, required: false },
});

UserSchema.pre("save", async function (next) {
  //pre ran before doc is saved to database
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", UserSchema);
