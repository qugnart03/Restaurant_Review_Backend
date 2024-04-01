const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");

//DOTENV
dotenv.config();

//MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//CLOUDINARY
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

//ROUTES
app.use("/api/v1/auth", require("./routes/userRoutes"));
// app.get("", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "----SERVER CONNECTED----",
//   });
// });

//PORT
const PORT = process.env.PORT || 8080;

//LISTEN PORT
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ${PORT}`.bgGreen.white);
});
