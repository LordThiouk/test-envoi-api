const app = require('./app');
const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error(err);
  else console.log("⏱ Heure actuelle :", res.rows[0].now);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
