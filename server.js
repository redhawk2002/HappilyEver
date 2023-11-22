const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config/.env" });
const user = require("./routes/user");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then((con) => console.log(`Database Connected: ${con.connection.host}`))
  .catch((err) => console.log(err));
app.use(bodyParser.json());

app.use("/api/v1", user);
app.listen(process.env.PORT, () => {
  console.log(`server is listening in PORT ${process.env.PORT}`);
});
