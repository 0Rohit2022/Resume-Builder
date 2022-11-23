const dotenv = require("dotenv");
const express = require("express");
const app = express();
dotenv.config();

// Database connectivity
require("./db/connect");
// Port no.
const PORT = process.env.PORT;

app.use(express.json())

// Routing 
const allRouters = require("./routers/router")

app.use("/", allRouters);

app.listen(PORT, () => {
  console.log(`Server is running on port no.${PORT}`);
});


