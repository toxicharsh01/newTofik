const Customer = require("../models/Customer");
const Product = require("../models/Product");

//CREATE
const addNewCustomer = async (req, res) => {
  const productNames = ["Mint", "Normal"];
  const products = await Product.find({ name: { $in: productNames } });
  const productIds = products.map((p) => p._id);
  try {
    const { name, phone, address, fixedRates } = req.body;

    const newCustomer = await Customer.create({
      name,
      phone,
      address,
      fixedRates: [
        {
          productIds: productIds,
          gramsPerPack: fixedRates[0].gramsPerPack,
          ratePerPack: fixedRates[0].ratePerPack,
        },
      ],
    });
    res.status(201).json({ success: true, cusotmer: newCustomer });
    console.log("new Customer saved");
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding customer" });
    console.log(error);
  }
};

//search customers

const searchCustomers = async (req, res) => {
  const { q } = req.query;
  console.log(q);

  if (!q) {
    return res.json({ results: [] });
  }

  const searchConditions = {
    name: { $regex: `^${q}`, $options: "i" },
  };
  const matchingCustomers = await Customer.find(searchConditions)
    .select("name phone")
    .limit(10);
  res.json({ customersList: matchingCustomers });
  console.log(matchingCustomers);
};

//READ
const getCustomers = async (req, res) => {
  try {
    const allCustomers = await Customer.find({});
    res.status(200).json({ success: true, data: allCustomers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
    console.error(error);
  }
};

const getCustomer = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const customer = await Customer.findById(id).select(
      "name phone address currentBalance fixedRates.gramsPerPack fixedRates.ratePerPack",
    );
    if (!customer) {
      return res
        .status(500)
        .json({ success: false, message: "Customer Not Found" });
    }
    return res.status(200).json({ success: true, data: customer });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "Customer Not Found" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// UPDATE
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, address, fixedRates } = req.body;
  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
        phone: phone,
        address: address,
        "fixedRates.0.gramsPerPack": fixedRates[0].gramsPerPack,
        "fixedRates.0.ratePerPack": fixedRates[0].ratePerPack,
      },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Customer Updated Successfully",
    updatedCustomer,
  });
};

//DELETE
const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  const deletedCustomer = await Customer.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Customer deleted Successfully",
    deletedCustomer,
  });
};

module.exports = {
  getCustomers,
  getCustomer,
  addNewCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
};
