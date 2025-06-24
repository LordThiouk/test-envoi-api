const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const { sendCallback } = require("../services/callback.service");

const handleEnvoi = async (req, res) => {
  const {
    montant,
    telephone,
    correlation_id,
    operateur,
    callback_url,
  } = req.body;

  // Liste des opérateurs valides
  const OPERATEURS_VALIDES = ["ORANGE", "EXPRESSO", "YAS"];

  //  Validation manuelle
  if (
    !montant || !telephone || !correlation_id ||
    !operateur || !callback_url
  ) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  if (!OPERATEURS_VALIDES.includes(operateur.toUpperCase())) {
    return res.status(400).json({
      error: `Opérateur invalide. Valeurs acceptées : ${OPERATEURS_VALIDES.join(", ")}`
    });
  }

  try {
    const transaction_id = uuidv4();
    const status = "SUCCESS";

    // Enregistrement dans la DB
    await pool.query(
      `INSERT INTO transactions (
        montant, telephone, correlation_id, transaction_id, status, operateur, callback_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        montant,
        telephone,
        correlation_id,
        transaction_id,
        status,
        operateur.toUpperCase(),
        callback_url
      ]
    );

    // Réponse à retourner
    const response = {
      montant,
      telephone,
      correlation_id,
      transaction_id,
      status,
      operateur: operateur.toUpperCase(),
      callback_url,
    };

    // Envoi du callback
    await sendCallback(callback_url, {
        montant,
        telephone,
        correlation_id,
        transaction_id,
        status,
        operateur: operateur.toUpperCase()
      });

    res.status(200).json(response);
  } catch (err) {
    console.error("Erreur d'envoi :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = { handleEnvoi };
