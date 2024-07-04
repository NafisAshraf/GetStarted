const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;

// mongodb connect
mongoose.connect("mongodb://localhost/GetStarted", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

app.get("/", (req, res) => {
  res.send("Hello All Over the World");
});

// Authentication routes
const auth = require("./routes/auth.routes");
app.use(express.json());
app.use(cors());
app.use("/api/auth", auth);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
