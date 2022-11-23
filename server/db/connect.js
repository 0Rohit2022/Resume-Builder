const mongoose = require("mongoose")

const DB = process.env.DATABASE;


// Database Connection
mongoose.connect(DB, { useNewUrlParser: true,useUnifiedTopology: true, })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });
