require("dotenv").config(); 
const express = require("express"); 
const mongoose = require("mongoose"); 
const cors = require("cors"); 
const app = express(); 
const PORT = process.env.PORT || 3000; 
// Middleware 
app.use(express.json()); 
app.use(cors()); 
// Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI) 
 .then(() => console.log("MongoDB Connected")) 
 .catch(err => console.error(err)); 
// Routes 
app.use("/api/auth", require("./routes/auth")); 
app.use("/api/students", require("./routes/students")); 
app.use((err, req, res, next) => {
 if (err.name === "CastError") {
  return res.status(400).json({ error: "Invalid resource id" });
 }
 if (err.name === "ValidationError") {
  return res.status(400).json({ error: err.message });
 }
 console.error(err);
 res.status(500).json({ error: "Internal server error" });
});
// Start server 
app.listen(PORT, () => { 
 console.log(`Server running on http://localhost:${PORT}`); });
