import express from "express";
import { createServer } from "node:http";

//Create an Express application
const app = express();

// Create an HTTP server
const server = createServer(app);

app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
