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
io.on("connection", async (socket) => {
    console.log(`🟢 New client connected with id: ${socket.id}`);
    // Listen for disconnection events
    socket.on("disconnect", () => {
        console.log(`🔴 Client disconnected with id: ${socket.id}`);
    });

    // Listen for chat message events
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);
    });

    // 
    try {
        const res = await socket
            .timeout(1)
            .emitWithAck("request", "Hello from server with timeout!", {
                name: "Mohamed",
            });
        // Client responded
        console.log("Client responded=>", res);
    } catch (e) {
        // the client did not acknowledge the event in the given delay
        console.log("Timeout occurred and client did not response:", e.message);
    }
});

// Emit a message to all connected clients
io.emit("chat message", "Welcome to the chat!");

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
