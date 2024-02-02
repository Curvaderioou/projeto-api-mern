import express from "express";
import connectDatabase from "./src/database/database.js";
import dotenv from "dotenv";

import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/news.route.js";
import swaggerRoute from "./src/routes/swagger.route.js";

dotenv.config();

const app = express();
import cors from "cors";
app.use(cors());

const port = process.env.PORT || 3000;

connectDatabase();

function contar(soma) {
  soma = 2;
  return soma;
}

app.use(express.json());
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/doc", swaggerRoute);

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
