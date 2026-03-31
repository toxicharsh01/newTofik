const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Count = require("../models/Count");
const Product = require("../models/Product");

//Create
const createOrder = async (req, res) => {
  const startOfTheDay = new Date();
  startOfTheDay.setHours(0, 0, 0, 0);
  const endOfTheDay = new Date();
  endOfTheDay.setHours(23, 59, 59, 999);

  const staticProducts = await Product.find({});
console.log(staticProducts);
  try {
    const { id } = req.params; // customer
    const { items } = req.body;

    const customer = await Customer.findById(id);

    const existingOrder = await Order.findOne({
      customerId: id,
      orderDate: { $gte: startOfTheDay, $lte: endOfTheDay },
    });

    if (existingOrder) {
      return res.status(500).json({
        success: false,
        message: `Today's Order is already exist for ${customer.name}`,
      });
    }

    const orderItems = items.map((item, index) => {
      return {
        productId: staticProducts[index], //auto
        packs: item.packs,
        ratePerPack: customer.fixedRates[0].ratePerPack, //auto
        totalAmount: item.packs * customer.fixedRates[0].ratePerPack, //auto
      };
    });

    const newOrder = await new Order({
      customerId: id,
      items: orderItems,
    });

    //Today TS count
    const count = new Count({
      customerId: customer._id,
      grams: customer.fixedRates[0].gramsPerPack,
      mintPacks: items[0].packs,
      normalPacks: items[1].packs,
    });

    await count.save();
    await newOrder.save();

    res.status(200).json({ success: true, order: newOrder });
    console.log("new Order saved");
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Read
const getTodaysOrders = async (req, res) => {
  const startOfTheDay = new Date();
  startOfTheDay.setHours(0, 0, 0, 0);
  const endOfTheDay = new Date();
  endOfTheDay.setHours(23, 59, 59, 999);

  try {
    const allOrders = await Order.find({
      orderDate: { $gt: startOfTheDay, $lt: endOfTheDay },
    })
      .populate("customerId")
      .populate({
        path: "items.productId",
        model: "Product",
      });

    res.status(200).json({ success: true, data: allOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: "error getting orders" });
  }
};

//Update Order
const updateOrder = async (req, res) => {
  const { id } = req.params; //order id
  const { items, isCompleted, isOrdered } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const customer = await Customer.findById(order.customerId);
    const count = await Count.findOne({ customerId: order.customerId });

    // Update items if provided
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        if (order.items[index]) {
          order.items[index].packs = item.packs;
          order.items[index].totalAmount = customer.fixedRates[0].ratePerPack * item.packs;
        }
      });

      count.mintPacks = items[0].packs;
      count.normalPacks = items[1].packs;
      await count.save();
    }

    // Update isCompleted / isOrdered if provided
    if (typeof isCompleted === "boolean") order.isCompleted = isCompleted;
    if (typeof isOrdered === "boolean") order.isOrdered = isOrdered;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
//Delete
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Order
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Find Customer
    const customer = await Customer.findById(order.customerId);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    await order.deleteOne();

    // Delete Related Count from record  (customer's ID)
    const countDeleted = await Count.findOneAndDelete({
      customerId: customer._id,
    });

    // send Response
    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      deletedCount: countDeleted,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCount = async (req, res) => {
  const startOfTheDay = new Date();
  startOfTheDay.setHours(0, 0, 0, 0);

  const endOfTheDay = new Date();
  endOfTheDay.setHours(23, 59, 59, 999);

  const counts = await Count.find({
    orderDate: { $gte: startOfTheDay, $lte: endOfTheDay },
  });

  const totalsByGrams = {};

  counts.forEach((item) => {
    if (!totalsByGrams[item.grams]) {
      totalsByGrams[item.grams] = { mintPacks: 0, normalPacks: 0 };
    }

    totalsByGrams[item.grams].mintPacks += item.mintPacks;
    totalsByGrams[item.grams].normalPacks += item.normalPacks;
  });

  return res.status(200).json({ success: true, totalsByGrams });
};

module.exports = {
  getTodaysOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getCount,
};
