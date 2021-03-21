// Requires
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userControllers"); 
// empêcher les utilisateurs de se connecter plus de 3 fois en 30 s avec le mauvais mot de passe incorrect
const bouncer = require("express-bouncer")(30000, 60000, 3);

// Setting controllers
router.post("/signup",  userCtrl.signup);


// Exporting Router
module.exports = router;