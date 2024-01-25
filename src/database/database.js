import mongoose from "mongoose";

const connectDatabase = () => {
  console.log("Conectando ao banco de dados . . .");
  //   mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Atlas Conectado"))
    .catch((error) => console.log(error));
};

export default connectDatabase;
