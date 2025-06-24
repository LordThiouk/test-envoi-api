const express = require("express");
const dotenv = require("dotenv");
const envoiRoute = require("./routes/envoi.routes.js");
const apiKeyMiddleware = require("./middlewares/apiKey.middleware");

dotenv.config();

const app = express();

app.use(express.json());
app.use(apiKeyMiddleware);

app.use("/envoi", envoiRoute);

module.exports = app;
