import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Get the directory name of the current module

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log("Current directory:", __dirname);


//Create an Express application
const app = express();

// Create an HTTP server
const server = createServer(app);

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
