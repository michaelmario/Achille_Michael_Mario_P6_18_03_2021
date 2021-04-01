const User = require('../models/UserSchema');
const util = require('../utils');

// Verifie si l'adress ail est déja utiliser 

module.export = async(req,res,next){
    const nbDocument = awit User.countDocuments();
    if(nbDocument == 0){
        next();
    }else{
        const users = await User.find();
        const user = users.reduce((acc,user)=>{
            const emailDecryted = utils.decrypt(user.email);
            if(emailDecryted === req.body.email){
                acc= user;
            }
            return acc;
        },null);
        if (user){
            return res.status(400).json({error:"Email déja utilisé"});
        }else{
            next();
        }
    }
}