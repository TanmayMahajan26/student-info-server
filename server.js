const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = 3000;

// Store students in memory
const students = {};

// ---------- Middleware ----------
app.use(morgan("dev"));
app.use(express.json()); // Added to parse JSON body for fetch requests
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ========== EXACT ASSIGNMENT ROUTES ONLY ==========

// GET / – Welcome message
app.get("/", (req, res) => {
  console.log("\n[API CALL] GET / -> Welcome message served");
  res.render("home", {
    message: "Welcome to the Student Information Server"
  });
});

// GET /about – Student name, roll number, course
app.get("/about", (req, res) => {
  console.log("\n[API CALL] GET /about\nResponse:\nName: Tanmay Mahajan\nRoll No: 10671\nCourse: Computer Engineering");
  res.render("about", {
    name: "Tanmay Mahajan",
    rollNo: "10671",
    course: "Computer Engineering"
  });
});

// GET /contact – Email or contact info
app.get("/contact", (req, res) => {
  console.log("\n[API CALL] GET /contact -> Email: tanmay261006@gmail.com");
  res.render("contact", {
    email: "tanmay261006@gmail.com"
  });
});

// GET /register – Display register form
app.get("/register", (req, res) => {
  res.render("register");
});

// GET /update – Display update form
app.get("/update", (req, res) => {
  res.render("update", { students });
});

// POST /register – Return status 201 Created
app.post("/register", (req, res) => {
  const { name, branch, year, roll } = req.body;
  if (roll) students[roll] = { name, branch, year, roll };
  
  console.log(`\n[API CALL] POST /register -> Status 201 Created\nData Submitted: ${JSON.stringify(req.body, null, 2)}`);
  res.status(201).send("Created");
});

// PUT /update – Return status 200 Updated
app.put("/update", (req, res) => {
  const { roll, name, branch, year } = req.body;
  
  if (!students[roll]) {
    console.log(`\n[API CALL] PUT /update -> Status 404 Not Found\nAttempted to update non-existent Roll: ${roll}`);
    return res.status(404).send("Error: Roll number not found in database!");
  }
  
  // Update the student's data
  students[roll] = { ...students[roll], name, branch, year };
  console.log(`\n[API CALL] PUT /update -> Status 200 Updated\nData Updated: ${JSON.stringify(req.body, null, 2)}`);
  res.status(200).send("Updated");
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Student Info Server running exactly as per assignment on http://localhost:${PORT}`);
});
