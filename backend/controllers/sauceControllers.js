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
  if (
    !regex.test(newSauce.name) ||
    !regex.test(newSauce.manufacturer) ||
    !regex.test(newSauce.description) ||
    !regex.test(newSauce.mainPepper) ||
    !regex.test(newSauce.heat)
  ) {
    return res
      .status(500)
      .json({ error: "Des champs contiennent des caractères invalides" }); // Checking from form input values format before dealing with them
  }
  const sauce = new Sauce({
    ...newSauce,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  }); // Creating new sauce accordig to schema and then, saveing it in DB
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// UPADTE Sauce
exports.modifySauce = (req, res, next) => {
  // Finding out if the image has been modifyed
  // If YES, inject req.body.sauce + new image in DB
  // If NO, inject every value from req.body in DB

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
      .json({ error: "Des champs contiennent des caractères invalides" }); // Checking from form input values format before dealing with them
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
      const filename = sauce.imageUrl.split("/images/")[1]; // Finding the image's name
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // Deleting the image in DB after deleting it from disk
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
