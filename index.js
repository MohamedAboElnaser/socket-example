import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

//Create an Express application
const app = express();

// Create an HTTP server
const server = createServer(app);

// Create a Socket.IO server
const io = new Server(server);

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log(`🟢 New client connected with id: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`🔴 Client disconnected with id: ${socket.id}`);
    });
    
}); 

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
