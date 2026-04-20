const express = require("express"); 
const router = express.Router(); 
const User = require("../models/user"); 
const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcryptjs"); 
// REGISTER 
router.post("/register", async (req, res) => { 
 try { 
 const { email, password } = req.body;
 if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
 const exists = await User.findOne({ email });  if (exists) return res.status(400).json({ error: "Email already registered" }); 
 const user = await User.create({ email, password }); 
 res.status(201).json({ message: "User registered", user: { id: user._id, email: user.email } }); 
 } catch (err) { 
 res.status(500).json({ error: err.message }); 
 } 
}); 
// LOGIN 
router.post("/login", async (req, res) => { 
 try {
 const { email, password } = req.body;
 if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
 const user = await User.findOne({ email }); 
 if (!user) return res.status(401).json({ error: "Invalid email or password" }); 
 const match = await bcrypt.compare(password, user.password);  if (!match) return res.status(401).json({ error: "Invalid email or password" }); 
 const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
 res.json({ message: "Login successful", token }); 
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
}); 
module.exports = router;
