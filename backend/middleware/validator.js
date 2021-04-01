const { body, validationResult } = require("express-validator");

// Checkinh email format and password length
const userValidationRules = () => {
  return [body("email").isEmail(), body("password").isLength({ min: 6 })];
};

// Error handeling
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) =>
    extractedErrors.push({
      message : "Le mot de passe doit faire au moins 6 caractères , au moins une minuscule et majuscule 8 caracter min et 100 max 2 chiffre min pas d'espace",
    })
  );
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  validate,
};

