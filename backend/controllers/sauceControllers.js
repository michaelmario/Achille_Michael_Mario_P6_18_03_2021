// Requires
const Sauce = require("../models/SauceSchema");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const regex = /^[a-zA-Z0-9 _.,!()&]+$/;

// CREATE Sauce
exports.addSauce = (req, res, next) => {
  const newSauce = JSON.parse(req.body.sauce);
  delete newSauce._id;
  //Vérification du format des valeurs d'entrée du formulaire avant de les traiter
  if (
    !regex.test(newSauce.name) ||
    !regex.test(newSauce.manufacturer) ||
    !regex.test(newSauce.description) ||
    !regex.test(newSauce.mainPepper) ||
    !regex.test(newSauce.heat)
  ) {
    return res
      .status(500)
      .json({ error: "Des champs contiennent des caractères invalides" }); 
      }
     // objet sauce
  const sauce = new Sauce({
    ...newSauce,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
   // Créer une nouvelle sauce selon le schéma, puis la sauvegarder dans DB
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// LIKE OR DISLIKE Sauce (AIMEZ OU N'AIMEZ PAS la sauce)
exports.likeOpinion = (req, res, next) => {
  // L'utilisateur a aimé la sauce
  // Pousser l'ID utilisateur dans le tableau des likes des utilisateurs et incrémenter les likes de 1
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Un like de plus !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  //Si l'utilisateur n'a pas aimé la sauce
  // Pousser l'ID utilisateur dans le tableau usersDejikes et décrémenter les likes de 1
  else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then((sauce) =>
        res.status(200).json({ message: "Un dislike de plus !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }

 // Si l'utilisateur a effacé son opinion
   // Selon que l'urseur aime ou n'a pas aimé la sauce avant d'annuler son avis:
   // Recherche et effacement de l'ID utilisateur dans le tableau usersLikes ou userDislikes
   // Décrémant les goûts ou les aversions par un
  else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Un like de moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Un dislike de moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

// UPADTE Sauce
exports.modifySauce = (req, res, next) => {
// Savoir si l'image a été modifiée
// Si VOUS, injectez req.body.sauce + new image dans DB 
// Si NON, injectez toutes les valeurs de req.body dans DB

  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.userId,
      };

  if (
    !regex.test(sauceObject.name) ||
    !regex.test(sauceObject.manufacturer) ||
    !regex.test(sauceObject.description) ||
    !regex.test(sauceObject.mainPepper) ||
    !regex.test(sauceObject.heat)
  ) {
    return res
      .status(500)
      .json({ error: "Des champs contiennent des caractères invalides" });
      // Vérification du format des valeurs d'entrée du formulaire avant de les traiter
       }

  Sauce.updateOne(
    { _id: req.params.id },
    {
      ...sauceObject,
      _id: req.params.id,
    }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// DELETE Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; 
      // Recherche du nom de l'image
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        // Suppression de l'image dans la base de données après l'avoir supprimée du disque 
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// GET ALL Sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// GET ONE Sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};