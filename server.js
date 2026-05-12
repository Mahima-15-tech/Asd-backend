const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
// app.use("/api/test", require("./routes/testroutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/plans", require("./routes/planRoutes"));
app.use("/api/master", require("./routes/itemsRoutes"));
app.use("/api/hs", require("./routes/HsRoutes"));
app.use("/api/country-rules", require("./routes/countryRuleRoutes"));
app.use("/api/dgft", require("./routes/dgftRoutes"));
app.use("/api/shipments", require("./routes/shipmentRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/trade", require("./routes/tradeRoutes"));
app.use("/api/buyers", require("./routes/buyerRoutes"));
app.use("/api/trade-intel", require("./routes/tradeIntelRoutes"));
app.use("/api/integrations", require("./routes/integrationRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/modules", require("./routes/moduleRoutes"));
app.use("/api/country", require("./routes/countryRoutes"));
// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));