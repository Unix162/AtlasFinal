const express = require("express");
const path = require("path");
const cors = require("cors");

const { configRoutes } = require("./routes/configRoutes");

require("./db/mongoConnect");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

configRoutes(app);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}