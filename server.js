const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

// ✅ Add this line to parse JSON body
app.use(express.json());   // <--- very important!

const schoolRoutes = require("./routes/schoolRoutes");
app.use("/api", schoolRoutes);

require("dotenv").config();
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
