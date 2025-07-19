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
    // Listen for disconnection events
    socket.on("disconnect", () => {
        console.log(`🔴 Client disconnected with id: ${socket.id}`);
    });

    // Listen for chat message events
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);
    });

    socket.timeout(3000).emit(
        "request", // name of the event
        "Hello from server with timeout!", // first argument
        { name: "Mohamed" }, // second argument (optional)
        // Callback function to handle the response
        (err, res) => {
            if (err) {
                console.log(
                    "Timeout occurred and client did not response:",
                    err
                );
            } else {
                // Client responded
                console.log("Client responded=>", res);
            }
        }
    );
});

// Emit a message to all connected clients
io.emit("chat message", "Welcome to the chat!");

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
