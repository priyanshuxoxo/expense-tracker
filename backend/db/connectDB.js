import mongoose from "mongoose";
const connectDb = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI);
    if (response) {
      console.log(
        "Database connected successfully: ",
        response.connection.host,
      );
    }
  } catch (error) {
    console.log("Database connection failed", error.message);
    process.exit(1);
  }
};
export default connectDb;
