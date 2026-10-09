import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
app.use(express.json());

// =================
// Root
// =================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "API Restaurante",
        version: "1.0.0"
    });
});

// =================
// Categories
// =================
app.use("/categories", categoryRoutes);

// =================
// Products
// =================
app.use("/products", productRoutes);

export default app;
