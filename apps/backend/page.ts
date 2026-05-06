import express from "express";

const app = express.Router();
app.use(express.json());

app.use("/v1/api/file-upload");
