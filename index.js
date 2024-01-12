require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./db/conn");

const login = require("./Routes/User/login");
const product = require("./Routes/Product/product");
const category = require("./Routes/Product/category");

const https = require("https");
const fs = require("fs");

connect();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const options = {
  key: fs.readFileSync(
    "/home/ec2-user/ssl/rajsareesenterprises.com/privkey1.pem"
  ),
  cert: fs.readFileSync(
    "/home/ec2-user/ssl/rajsareesenterprises.com/fullchain1.pem"
  ),
};

const httpsServer = https.createServer(options, app);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/user", login);
app.use("/api/product", product);
app.use("/api/category", category);

httpsServer.listen(port, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
