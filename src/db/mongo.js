import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

async function mongoConnect() {
  try {
    const mongo = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log("Connection Successful");
    console.log("Host: ", mongo.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default mongoConnect;
