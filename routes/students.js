const express = require("express"); 
const router = express.Router(); 
const Student = require("../models/students"); 
const auth = require("../middleware/auth"); 
// GET all students 
router.get("/", auth, async (req, res) => { 
 const students = await Student.find(); 
 res.json(students); 
}); 
// CREATE student 
router.post("/", auth, async (req, res) => {
 const student = await Student.create(req.body); 
 res.status(201).json(student); 
}); 
// GET one student 
router.get("/:id", auth, async (req, res) => { 
 const student = await Student.findById(req.params.id); 
 if (!student) return res.status(404).json({ error: "Student not found" });
 res.json(student); 
}); 
// UPDATE student 
router.put("/:id", auth, async (req, res) => { 
 const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); 
 if (!student) return res.status(404).json({ error: "Student not found" });
 res.json(student); 
}); 
// DELETE student 
router.delete("/:id", auth, async (req, res) => { 
 const student = await Student.findByIdAndDelete(req.params.id); 
 if (!student) return res.status(404).json({ error: "Student not found" });
 res.json({ message: "Student deleted" }); 
}); 
module.exports = router; 
