const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const apiRoutes = require("./api/app");
app.use("/", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
