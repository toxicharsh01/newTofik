const route = require("express").Router();
const {
  addNewCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  searchCustomers,
} = require("../controller/customer.controller");

route.get("/search-customers", searchCustomers);
route.post("/customers", addNewCustomer);
route.get("/customers", getCustomers);
route.get("/customers/:id", getCustomer);
route.put("/customers/:id", updateCustomer);
route.delete("/customers/:id", deleteCustomer);
module.exports = route;
