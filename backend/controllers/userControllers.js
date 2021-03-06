// Requires
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const maskData = require("maskdata");
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


const emailMaskOptions = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 1,
  unmaskedEndCharactersAfterAt: 1,
  maskAtTheRate: false,
}; 


exports.signup = (req, res, next) => {
   if (!mailValidator.validate(req.body.email)) {
     // Making sure the amil is an email
    throw {
      error: "L'adresse mail n'est pas valide !", 
    };
  } else if (!schema.validate(req.body.password)) {
    // Making sure the password respect the schema
   throw {
     error : "Le mot pass n'est pas valide !"   
  }
}
  else { 
  // Hashing et salage du mot de passe 
    bcrypt
      .hash(req.body.password, 10) 
      .then((hash) => {
        const user = new User({
          email: maskData.maskEmail2(req.body.email, emailMaskOptions),
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

exports.login = (req, res, next) => {
  User.findOne({ email:maskData.maskEmail2(req.body.email, emailMaskOptions), }) // Finding the user in DB
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: "Aucun compte ne correspond à l'adresse email renseingée !", // Return error if user is not found un DB
        });
      }
      bcrypt
        .compare(req.body.password, user.password) // Compare the hashed tryed password to the hashed stored paswword
        .then((valide) => {
          if (!valide) {
            return res
              .status(401)
              .json({ error: "Mot de passe incorrect !" }); // Return error if paswwords don't match
          }

          const newToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_TOKEN,
            { expiresIn: "24h" }
          );

          res.status(200).json({ userId: user._id, token: newToken });
        })

        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};



