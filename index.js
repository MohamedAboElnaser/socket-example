import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// open the database file
const db = await open({
    filename: "chat.db",
    driver: sqlite3.Database,
});

// Create the messages table if it doesn't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
  );
`);

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
    socket.on("chat message", async (msg, clientOffset, cb) => {
        console.log("message: " + msg);
        // Save the message to the database
        let result;
        try {
            result = await db.run(
                "INSERT INTO messages (content, client_offset) VALUES (?, ?)",
                msg,
                clientOffset // Use clientOffset to ensure uniqueness
            );
        } catch (e) {
            if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
                // the message was already inserted, so we notify the client
                callback();
            } else {
                // nothing to do, just let the client retry
            }
            return;
        }
        console.log("Message saved with ID:", result.lastID);

        // Emit the message to all connected clients including the sender
        io.emit("chat message", msg, result.lastID);
        // Acknowledge the message reception
        cb();
    });

    if (!socket.recovered) {
        // if the connection state recovery was not successful
        try {
            await db.each(
                "SELECT id, content FROM messages WHERE id > ?",
                [socket.handshake.auth.serverOffset || 0],
                (_err, row) => {
                    socket.emit("chat message", row.content, row.id);
                }
            );
        } catch (e) {
            // something went wrong
            console.error("Error fetching messages:", e);
        }
    }
});

// Emit a message to all connected clients
io.emit("chat message", "Welcome to the chat!");

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
