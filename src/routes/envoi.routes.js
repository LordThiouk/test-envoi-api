
const express = require("express");
const router = express.Router();
const envoiController = require("../controllers/envoi.controller");

router.post("/", envoiController.handleEnvoi);

module.exports = router;
