// Requires
const User = require("../models/UserSchema");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const mongoMask = require("mongo-mask");
const session = require("express-session");

// Creating a validation schema for password
var schema = new passwordValidator();
schema
  .is()
  .min(6)
  .is()
  .max(20)
  .has()
  .not()
  .spaces()
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1);

exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email)) {
    throw {
      error: "L'adresse mail n'est pas valide !", // Making sure the amil is an email
    };
  } else if (!schema.validate(req.body.password)) {
    throw {
      error: "Le mot pass n'est pas valide !", // Making sure the password respect the schema
    };
  } else { 
  // Hashing et salage du mot de passe 
    bcrypt
      .hash(req.body.password, 10) 
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        }); 
        // Créer un nouvel utilisateur
        user
          .save() // Enregistrer l'utilisateur dans la base de données
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(501).json({ error }));
  }
}


