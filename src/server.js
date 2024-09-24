import http from "node:http";
import app from "./app.js";
import mongoConnect from "./db/mongo.js";
// import { verifySMTPConnection } from "./services/mail.services.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  // await verifySMTPConnection();
  server.listen(PORT, () => console.log(`Server Is Listening On ${PORT}`));
}

startServer();