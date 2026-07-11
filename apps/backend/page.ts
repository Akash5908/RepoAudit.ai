import express from "express";
import { fileUploadRouter } from "./router/file-upload.router";

const app = express();
app.use(express.json());

app.use("/v1/api/file-upload", fileUploadRouter);

function startServer() {
  app.listen(5000, () => {
    console.log("Server started on port 5000");
  });
}

startServer();
