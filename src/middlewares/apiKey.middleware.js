require("dotenv").config();


module.exports = (req, res, next) => {
    const apiKey = req.header('API-KEY');

    if(!apiKey) {
        return res.status(401).json({error: "API-KEY manquante"});
    }

    if(apiKey !== process.env.API_KEY) {
        return res.status(401).json({error: "API-KEY invalide"});
    }

    next();
};