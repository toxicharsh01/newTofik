const express = require("express");
const app = express();
const cors = require("cors");
require("./utils/db");

const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const customerRoutes = require("./routes/Customer.route.js");
const orderRoutes = require("./routes/Order.route.js");

app.use("/tofik", customerRoutes);
app.use("/tofik", orderRoutes);

app.listen(PORT,"0.0.0.0", () => {
  console.log(`app is running on port ${PORT}`);
});
