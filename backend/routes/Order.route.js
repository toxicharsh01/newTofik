const {
  getTodaysOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getCount,
  getReports,
} = require("../controller/order.controller");

const route = require("express").Router();

route.get("/orders", getTodaysOrders);
route.post("/orders/:id", createOrder);
route.put("/orders/:id", updateOrder);
route.delete("/orders/:id", deleteOrder);
route.get("/orders/reports", getReports);
//getCount
route.get("/orders/count", getCount)

module.exports = route;
