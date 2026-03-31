const Product = require("../newModels/Product");

const createProduct = async (req, res) => {
  const { name } = req.body;
  const newProduct = await Product.create({
    name,
  });
  return res
    .status(200)
    .json({ success: true, message: "Product added successfully", newProduct});
};


const createProds = async () => {
  const name1 = "Mint";
  const name2 = "Normal";

  const p = new Product({
    name1,
    name2
  });
  const saved =await p.save();
  console.log(saved);
}

createProds();

const getAllProducsts = async (req, res) => {
  const allProducts = await Product.find({});
  return res.status(200).json({ allProducts });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedProduct = await Product.findByIdAndUpdate({
    name,
  });
  return res.status(200).json({ success: true, updatedProduct });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  return res
    .status(200)
    .json({ success: true, message: "Product Deleted successfully" });
};

module.exports = {
  createProduct,
  getAllProducsts,
  updateProduct,
  deleteProduct,
};
