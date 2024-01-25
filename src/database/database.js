import mongoose from "mongoose";

const connectDatabase = () => {
  console.log("Conectando ao banco de dados . . .");
  //   mongoose.set("strictQuery", false);
  mongoose
    .connect(
      "mongodb+srv://devdigitalmix:Fv020385@cluster0.kjtfcwb.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => console.log("MongoDB Atlas Conectado"))
    .catch((error) => console.log(error));
};

export default connectDatabase;
