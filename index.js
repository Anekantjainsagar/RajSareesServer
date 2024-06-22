require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./db/conn");

const login = require("./Routes/User/login");
const product = require("./Routes/Product/product");
const category = require("./Routes/Product/category");
const admin = require("./Routes/Admin/admin");
const order = require("./Routes/Order/order");

const http = require("http");
const https = require("https");

const corsOptions = {
  origin: "https://raj-sarees.vercel.app", // your frontend URL
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
connect();

const port = process.env.PORT || 5000;
// const options = {
//   key: fs.readFileSync(
//     "/home/ec2-user/ssl/rajsareesenterprises.com/privkey1.pem"
//   ),
//   cert: fs.readFileSync(
//     "/home/ec2-user/ssl/rajsareesenterprises.com/fullchain1.pem"
//   ),
// };

// const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/admin", admin);
app.use("/api/user", login);
app.use("/api/order", order);
app.use("/api/product", product);
app.use("/api/category", category);

httpServer.listen(port, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
