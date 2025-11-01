import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./controllers/authController.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import productRouter from "./controllers/productController.js";
import cartRouter from "./controllers/cartController.js";
import orderRouter from "./controllers/orderController.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description:
        "Auth (Register/Login) va boshqa endpointlar uchun Swagger hujjat",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`, // Swagger server URL
        description: "Local server",
      },
      {
        url: `https://ecommerce-backend-wmh9.onrender.com`, // Production server URL
        description: "Production server",
      },
    ],
  },
  apis: ["./src/controllers/*.js"], // shu papkadagi route fayllar ichidagi @swagger kommentlarni o‘qiydi
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Run server
app.listen(process.env.PORT, () => {
  console.log(
    `✅ Server is running on port http://localhost:${process.env.PORT}`
  );
  console.log(`📄 Swagger docs: http://localhost:${process.env.PORT}/api-docs`);
});

export default app;
