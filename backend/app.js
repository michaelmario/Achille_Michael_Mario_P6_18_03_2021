// Requires
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// Security Requires
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const xssClean = require("xss-clean");


// Routes
const sauceRoutes = require("./routes/sauceRoutes");
const userRoutes = require("./routes/userRoutes");

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,

  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Start the Express app INITIALIZE express app 
const app = express();

// Helmet middlware for safe headers
//Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// middleware express-rate-limit pour limiter le nombre de requêtes effectuées
/*const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
});
app.use(limiter);*/

//Définition des (headers) en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("x-powered-by" , false);
  //res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Parsing req in json format 
app.use(bodyParser.json());

//for handling form data 
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// Security
// middleware qui nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB.
app.use(mongoSanitize());

// middleware Morgan pour créer des logs  au format combiné Apache dans STDOUT
app.use(morgan("combined"));

//middleware  HTTP pour se protéger contre les attaques de pollution des paramètres HTTP 
app.use(hpp());

//methode faille xss nettoie
// les entrées utilisateur provenant du corps POST, des requêtes GET et des paramètres d'URL

app.use(xssClean());

// gere les images dans le fichier image qui est statique
app.use("/images", express.static(path.join(__dirname, "images")));

// Setting routes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

//Gere les erreurs global 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({message:'Something broke!'});
})

module.exports = app;
