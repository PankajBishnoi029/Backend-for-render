const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

const autoSchema = new mongoose.Schema({
  Uid: { type: String },
  Aid: { type: String }, // Aid is stored as a string
  id: { type: String },
});

// Create the model for the auto collection
const Auto = mongoose.model("Auto", autoSchema);
//
//
//
const customerSchema = new mongoose.Schema({
  Uid: { type: String, required: true },
  Uname: { type: String },
  address: { type: String },
  phone: { type: String },
  Uemail: { type: String },
  password: { type: String },

  markdone: { type: [String], default: [] },
  // Markdone should be an array of strings
  cart: [
    {
      Uemail: { type: String },
      id: { type: String },
      name: { type: String },
      description: { type: String },
      price: { type: String },
      image: { type: String },
    },
  ],
  purchasedProducts: [
    {
      Uemail: { type: String },
      id: { type: String },
      name: { type: String },
      description: { type: String },
      price: { type: String },
      image: { type: String },
    },
  ],
});

const Customer = mongoose.model("Customer", customerSchema);

const AdminSchema = new mongoose.Schema({
  Aid: { type: String, required: true },
  Aname: { type: String },
  address: { type: String },
  phone: { type: String },
  Aemail: { type: String },
  password: { type: String },
  Products: [
    {
      type: [
        { type: String },
        [
          {
            id: { type: String },
            name: { type: String },
            description: { type: String },
            price: { type: String },
            image: { type: String },
          },
        ],
      ],
    },
  ],
});

const Admin = mongoose.model("Admin", AdminSchema);

app.use(cors());
app.use(express.json());

app.post("/signupAdmin", async (req, res) => {
  const { Aname, address, phone, Aemail, password } = req.body;
  if (!Aname) {
    return res.json({ message: "Please provide Aname" });
  }
  if (!address) {
    return res.json({ message: "address" });
  }
  if (!phone) {
    return res.json({ message: "phone" });
  }
  if (!Aemail) {
    return res.json({ message: "Aemail" });
  }
  if (!password) {
    return res.json({ message: "password" });
  }

  try {
    const existingAdmin = await Admin.findOne({ Aemail });
    if (existingAdmin) {
      return res.json({ message: "Admin ID already exists" });
    }

    let autoDoc = await Auto.findOne();
    if (!autoDoc) {
      autoDoc = new Auto({
        Uid: 0,
        Aid: 0,
        id: 0,
      });
      await autoDoc.save();
    }

    autoDoc.Aid++;
    await autoDoc.save();

    // Create the new admin with the incremented Aid
    const newAdmin = new Admin({
      Aid: autoDoc.Aid,
      Aname,
      address,
      phone,
      Aemail,
      password,
    });

    await newAdmin.save();
    return res.status(201).json({
      message: "Signup success",
      user: { Aid: autoDoc.Aid, Aname, address, phone, Aemail, password },
    });
  } catch (err) {
    console.log("Error saving Admin:", err);
    return res.json({ message: "Database error" });
  }
});

///

app.post("/loginAdmin", async (req, res) => {
  const { Aemail, password } = req.body;

  if (!Aemail) {
    return res.json({ message: "Email is required" });
  }

  if (!password) {
    return res.json({ message: "Password is required" });
  }

  try {
    const user = await Admin.findOne({ Aemail });
    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    if (user.password !== password) {
      return res.json({ message: "Wrong password" });
    }

    return res.json({ message: "Login success", user });
  } catch (err) {
    console.log("Error finding Admin:", err);
    return res.json({ error: "Database error" });
  }
});

//new added ****

/// route to update product ******
app.put("/updateProduct", async (req, res) => {
  const { Aemail, id, name, description, price, image } = req.body;

  if (!Aemail || !id || !name || !description || !price || !image) {
    return res.json({ message: "Please provide all required fields" });
  }

  try {
    const admin = await Admin.findOne({ Aemail });

    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    for (let i = 0; i < admin.Products.length; i++) {
      if (admin.Products[i].id === id) {
        admin.Products[i] = { id, name, description, price, image };
        await admin.save();
        return res.json({ message: "Product updated successfully", admin });
      }
    }

    return res.json({ message: "Product not found" });
  } catch (err) {
    console.log("Error updating product:", err);
    return res.json({ message: "Database error" });
  }
});
//
//
//
//
//Riute to update passsword ****

app.post("/updatePassword", async (req, res) => {
  const { Aemail, newPassword } = req.body;

  if (!Aemail || !newPassword) {
    return res.json({ message: "Please provide Aid and newPassword" });
  }

  try {
    const admin = await Admin.findOne({ Aemail });

    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    admin.password = newPassword;
    await admin.save();

    return res.json({ message: "Password updated successfully", admin });
  } catch (err) {
    console.log("Error updating Password:", err);
    return res.json({ message: "Database error" });
  }
});
//
//
//
//
//Route to update phone no ****

app.post("/updatePhone", async (req, res) => {
  const { Aemail, newPhone } = req.body;

  if (!Aemail || !newPhone) {
    return res.json({ message: "Please provide Aid and newPhone" });
  }

  try {
    const admin = await Admin.findOne({ Aemail });

    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    admin.phone = newPhone;
    await admin.save();

    return res.json({ message: "Phone number updated successfully", admin });
  } catch (err) {
    console.log("Error updating Phone Number:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//
//
//Route to update email ****
app.post("/updateemail", async (req, res) => {
  const { Aemail, newAemail } = req.body;

  if (!Aemail || !newAemail) {
    return res.json({ message: "Please provide Aid and email" });
  }

  try {
    const admin = await Admin.findOne({ Aemail });

    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    admin.Aemail = newAemail;
    await admin.save();

    return res.json({ message: "email  number updated successfully", admin });
  } catch (err) {
    console.log("Error updating email Number:", err);
    return res.json({ message: "Database error" });
  }
});

app.put("/updateProduct", async (req, res) => {
  const { Aemail, id, name, description, price, image } = req.body;

  // Validate input
  if (!Aemail || !id || !name || !description || !price || !image) {
    return res.json({ message: "Please provide all required fields" });
  }

  try {
    // Find the admin by Aid
    const admin = await Admin.findOne({ Aemail });

    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    // Check if the new ID already exists in other products
    for (let i = 0; i < admin.Products.length; i++) {
      if (admin.Products[i].id === id) {
        // Update the product details if ID matches
        admin.Products[i] = { id, name, description, price, image };
        await admin.save();
        return res.json({ message: "Product updated successfully", admin });
      }
    }

    // If product ID is not found in the list
    return res.json({ message: "Product not found" });
  } catch (err) {
    console.log("Error updating product:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//
//Route to add product ****

app.post("/add-product", async (req, res) => {
  const { Aemail, name, description, price, image } = req.body;

  if (!Aemail) {
    return res.json({ message: "Please provide the email" });
  }
  if (!name) {
    return res.json({ message: "Please provide the name" });
  }
  if (!description) {
    return res.json({ message: "Please provide the description" });
  }
  if (!price) {
    return res.json({ message: "Please provide the price" });
  }
  if (!image) {
    return res.json({ message: "Please provide the image" });
  }

  try {
    const admin = await Admin.findOne({ Aemail });

    if (!admin) {
      return res.json({ message: "User does not exist" });
    }

    let autoDoc = await Auto.findOne();
    if (!autoDoc) {
      autoDoc = new Auto({
        Uid: 0,
        Aid: 0,
        id: 0,
      });
      await autoDoc.save();
    }

    autoDoc.id++;
    await autoDoc.save();

    admin.Products.push({ id: autoDoc.id, name, description, price, image });
    await admin.save();

    return res.json({ message: "Product added successfully", user: admin });
  } catch (err) {
    console.log("Error adding product:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//Riute to get-customer ****
app.post("/get-customers", async (req, res) => {
  const { Aemail } = req.body;

  if (!Aemail) {
    return res.json({ message: "Admin ID is required" });
  }

  try {
    const admin = await Admin.findOne({ Aemail });
    if (!admin) {
      return res.json({ message: "Admin does not exist" });
    }

    const customers = await Customer.find();
    return res.json({ customers });
  } catch (err) {
    console.log("Error fetching customers:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//
//Route to delete customer ****
app.delete("/delete-customer", async (req, res) => {
  const { Aemail, Uid } = req.body;

  console.log("Received DELETE request with:", { Aemail, Uid });

  if (!Aemail || !Uid) {
    return res.status(400).json({ message: "Please provide both Aid and Uid" });
  }

  try {
    const admin = await Admin.findOne({ Aemail });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const result = await Customer.deleteOne({ Uid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.log("Error deleting customer:", err);
    return res.status(500).json({ message: "Database error" });
  }
});
//
//
//
//
//Route to delete product ****

app.delete("/delete-product", async (req, res) => {
  const { Aemail, id } = req.body;

  console.log("Received DELETE request with:", { Aemail, id });

  if (!Aemail || !id) {
    return res.json({ message: "Please provide both Aid and productId" });
  }

  try {
    const admin = await Admin.findOne({ Aemail });

    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    let productFound = false;

    for (let i = 0; i < admin.Products.length; i++) {
      if (admin.Products[i].id === id) {
        admin.Products.splice(i, 1);
        productFound = true;
        break;
      }
    }

    if (!productFound) {
      return res.json({ message: "Product not found" });
    }

    await admin.save();
    return res.json({ message: "Product deleted successfully", admin });
  } catch (err) {
    console.log("Error deleting product:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//
//Route to get all products ****
app.get("/all-products", async (req, res) => {
  try {
    const admins = await Admin.find({});
    const allProducts = admins.flatMap((admin) => admin.Products);

    return res.json({ products: allProducts });
  } catch (err) {
    console.log("Error fetching all products:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//
//Route to signupuser ****
app.post("/signup", async (req, res) => {
  const { Uname, Uid, address, phone, Uemail, password } = req.body;

  if (!Uname || !address || !phone || !Uemail || !password) {
    return res.send({ message: "Please provide all the required fields" });
  }
  try {
    const existingCustomer = await Customer.findOne({ Uemail });

    if (existingCustomer) {
      return res.send({ message: "Email already exists" });
    }

    let autoDoc = await Auto.findOne();
    if (!autoDoc) {
      autoDoc = new Auto({
        Uid: 0,
        Aid: 0,
        id: 0,
      });
      await autoDoc.save();
    }

    autoDoc.Uid++;
    await autoDoc.save();

    const newCustomer = new Customer({
      Uid: autoDoc.Uid,
      Uname,
      address,
      phone,
      Uemail,
      password,
    });

    await newCustomer.save();

    return res.status(201).json({
      message: "Signup successful! Welcome to our platform.",
      user: { Uid, Uname, address, phone, Uemail, password },
    });
  } catch (err) {
    console.log("Error saving customer:", err);
    return res.json({ message: "Database error" });
  }
});

app.post("/login", async (req, res) => {
  const { Uemail, password } = req.body;

  if (!Uemail) {
    return res.status(400).json({ message: "Uemail is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await Customer.findOne({ Uemail });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    return res.status(200).json({ message: "Login successful", success: true });
  } catch (err) {
    console.error("Error finding customer:", err);
    return res.status(500).json({ message: "Database error" });
  }
});

//
//
//
//
//Route to update login id ****
app.post("/update-login-id", async (req, res) => {
  const { Uemail, newLoginUemail } = req.body;

  if (!Uemail || !newLoginUemail) {
    return res.json({ message: "Please provide Uid and newLoginId" });
  }

  try {
    const customer = await Customer.findOne({ Uemail });

    if (!customer) {
      return res.json({ message: "User not found" });
    }

    const allCustomers = await Customer.find();
    for (let i = 0; i < allCustomers.length; i++) {
      if (allCustomers[i].Uemail === newLoginUemail) {
        return res.json({ message: "New login ID already in use" });
      }
    }

    customer.Uemail = newLoginUemail;
    await customer.save();

    return res.json({ message: "Login ID updated successfully" });
  } catch (err) {
    console.log("Error updating login ID:", err);
    return res.json({ message: "Database error" });
  }
});
// /*'' */

//
//
//
//
//Route to update password ****
app.post("/update-password", async (req, res) => {
  const { Uemail, oldPassword, newPassword } = req.body;

  if (!Uemail || !oldPassword || !newPassword) {
    return res.json({
      message: "Please provide Uid, oldPassword, and newPassword",
    });
  }

  try {
    const customer = await Customer.findOne({ Uemail });

    if (!customer) {
      return res.json({ message: "User not found" });
    }

    if (customer.password !== oldPassword) {
      return res.json({ message: "Old password is incorrect" });
    }

    customer.password = newPassword;
    await customer.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.log("Error updating password:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//
//Route to mark done  ****
app.post("/Mark", async (req, res) => {
  const { Uemail, Mdone } = req.body;

  if (!Uemail || !Mdone) {
    return res.json({ message: "Please provide all information" });
  }

  try {
    const customer = await Customer.findOne({ Uemail });

    if (!customer) {
      return res.json({ message: "ID not found" });
    }

    const existingMarkdone = customer.markdone;

    for (let a = 0; a < existingMarkdone.length; a++) {
      if (existingMarkdone[a] === Mdone) {
        return res.json({ message: "Already marked as done" });
      }
    }

    customer.markdone.push(Mdone);

    await customer.save();

    return res.json({ message: "Marked as done successfully" });
  } catch (err) {
    console.log("Error during markdone:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//
//Route to get all markdone ****
app.post("/Markdone", async (req, res) => {
  const { Uemail } = req.body;

  if (!Uemail) {
    return res.json({ message: "Please provide a Uid" });
  }

  try {
    const user = await Customer.findOne({ Uemail });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    return res.json({ markdone: user.markdone || [] });
  } catch (err) {
    console.log("Error retrieving markdone data:", err);
    return res.json({ message: "Database error" });
  }
});

//
//
//
//
app.post("/purchase", async (req, res) => {
  // Extract fields from the request body
  const { Uemail, name, description, price, image } = req.body;

  // Validate input
  if (!Uemail) {
    return res.json({ message: "Please provide your email" });
  }
  if (!name) {
    return res.json({ message: "Please provide a name" });
  }
  if (!description) {
    return res.json({ message: "Please provide a description" });
  }
  if (!price) {
    return res.json({ message: "Please provide a price" });
  }
  if (!image) {
    return res.json({ message: "Please provide an image" });
  }

  try {
    // Find the user by email
    const user = await Customer.findOne({ Uemail });

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    // Add new product to the purchasedProducts array
    user.purchasedProducts.push({
      name, // Product name
      description, // Product description
      price, // Product price
      image, // Product image URL
    });

    // Save the user document
    await user.save();

    // Respond with success message
    return res.json({ message: "Product purchased successfully", user });
  } catch (err) {
    console.error("Error purchasing product:", err);
    return res.json({ message: "Database error" });
  }
});

app.post("/cart", async (req, res) => {
  // Extract fields from the request body
  const { Uemail, name, description, price, image } = req.body;

  // Validate input
  if (!Uemail) {
    return res.json({ message: "Please provide your email" });
  }
  if (!name) {
    return res.json({ message: "Please provide a name" });
  }
  if (!description) {
    return res.json({ message: "Please provide a description" });
  }
  if (!price) {
    return res.json({ message: "Please provide a price" });
  }
  if (!image) {
    return res.json({ message: "Please provide an image" });
  }

  try {
    // Find the user by email
    const user = await Customer.findOne({ Uemail });

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    // Add new product to the purchasedProducts array
    user.cart.push({
      name, // Product name
      description, // Product description
      price, // Product price
      image, // Product image URL
    });

    // Save the user document
    await user.save();

    // Respond with success message
    return res.json({ message: "Product purchased successfully", user });
  } catch (err) {
    console.error("Error purchasing product:", err);
    return res.json({ message: "Database error" });
  }
});
//

//
app.get("/cartadded", async (req, res) => {
  const { Uemail } = req.query; // Use req.query to get parameters from URL

  if (!Uemail) {
    return res.status(400).json({ message: "Uemail is required" });
  }

  try {
    const user = await Customer.findOne({ Uemail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Make sure the response key matches what you're looking for in React
    return res.json({ cart: user.cart });
  } catch (err) {
    console.error("Error finding user or cart:", err);
    return res.status(500).json({ message: "Database error" });
  }
});
//
//
//
//
app.get("/purchased-courses", async (req, res) => {
  const { Uemail } = req.query; // Use req.query to get parameters from URL

  if (!Uemail) {
    return res.status(400).json({ message: "Uemail is required" });
  }

  try {
    const user = await Customer.findOne({ Uemail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ courses: user.purchasedProducts });
  } catch (err) {
    console.log("Error finding purchased courses:", err);
    return res.status(500).json({ message: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
