import express from "express";
import connectDatabase from "./src/database/database.js";
import userRoute from "./src/routes/user.route.js";

const app = express();

const port = 3000;

connectDatabase();

app.use(express.json());
app.use("/user", userRoute);

app.listen(3000, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
