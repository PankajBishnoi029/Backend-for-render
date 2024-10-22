const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json()); // Ensure the server can parse JSON
app.use(cors()); // Enable CORS

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

// Define the Admin schema and model
const AdminSchema = new mongoose.Schema({
  Aid: { type: String, required: true },
  Aname: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  password: { type: String },
  Addproducts: [
    {
      id: { type: String },
      name: { type: String },
      description: { type: String },
      price: { type: String },
      image: { type: String },
    },
  ],
});

const Admin = mongoose.model("Admin", AdminSchema);

app.post("/signupAdmin", async (req, res) => {
  const { Aid, Aname, address, phone, email, password } = req.body;

  if (!Aid || !Aname || !address || !phone || !email || !password) {
    return res.send({ message: "Please provide all the required fields" });
  }

  try {
    const newAdmin = new Admin({
      Aid,
      Aname,
      address,
      phone,
      email,
      password,
    });

    await newAdmin.save();
    return res.json({
      message: "Signup success",
      user: { Aid, Aname, address, phone, email, password },
    });
  } catch (err) {
    console.error("Error saving Admin:", err);
    return res.json({ message: "Database error" });
  }
});

app.post("/loginAdmin", async (req, res) => {
  const { Aid, password } = req.body;

  if (!Aid || !password) {
    return res.json({ message: "All fields are required" });
  }

  try {
    const user = await Admin.findOne({ Aid });
    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    if (user.password !== password) {
      return res.json({ message: "Wrong password" });
    }

    return res.json({ message: "Login success", user });
  } catch (err) {
    console.error("Error finding Admin:", err);
    return res.json({ error: "Database error" });
  }
});

app.post("/add-product", async (req, res) => {
  const { Aid, id, name, description, price, image } = req.body;

  if (!Aid || !id || !name || !description || !price || !image) {
    return res.json({ message: "Please provide all the required fields" });
  }

  try {
    const user = await Admin.findOne({ Aid });

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    const existingProduct = user.Addproducts;
    console.log(existingProduct);

    for (let i = 0; i < existingProduct.length; i++) {
      if (existingProduct[i].id === id) {
        return res.json({ message: "Product already added" });
      }
    }

    user.Addproducts.push({ id, name, description, price, image });

    await user.save();

    return res.json({ message: "Product added successfully", user });
  } catch (err) {
    console.error("Error adding product:", err);
    return res.json({ message: "Database error" });
  }
});

app.post("/get-customers", async (req, res) => {
  const { Aid } = req.body;

  if (!Aid) {
    return res.json({ message: "Admin ID is required" });
  }

  try {
    const admin = await Admin.findOne({ Aid });
    if (!admin) {
      return res.json({ message: "Admin does not exist" });
    }

    const customers = await Customer.find();
    return res.json({ customers });
  } catch (err) {
    console.error("Error fetching customers:", err);
    return res.json({ message: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
