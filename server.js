const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config/.env" });
const user = require("./routes/user");
app.use(bodyParser.json());

app.use("/api/v1", user);
app.listen(process.env.PORT, () => {
  console.log(`server is listening in PORT ${process.env.PORT}`);
});
