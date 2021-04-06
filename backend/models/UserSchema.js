// Requires
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Creating Schema
const userSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    required: [true, 'Email is required'],
    maxlength: [128, 'Email can\'t be greater than 128 characters'],
    unique: true,
     // Using mongoose-unique-validator so two acounts can't be created with the same email
  },
  password: {
    type: String,
    required: true,
  },
  date:
    { type: Date, default: Date.now }
  
});

// Appying mongoose-unique-validator to the schema
userSchema.plugin(uniqueValidator);

// Exporting User Schema
module.exports = mongoose.model("User", userSchema);
