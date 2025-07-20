# Socket.IO Chat Example

> This project follows the official [Socket.IO tutorial](https://socket.io/get-started/chat) and serves as a practical implementation guide.

A simple real-time chat application built with Socket.IO, Express, and SQLite.

## Features

-   Real-time messaging between multiple clients
-   Message persistence with SQLite database
-   Connection state recovery
-   Manual connect/disconnect functionality
-   Automatic reconnection with retry logic

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MohamedAboElnaser/socket-example.git
cd socket-chat-example
```

2. Install dependencies:

```bash
npm install
```

## Usage

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

## How it works

-   Messages are stored in SQLite database (`chat.db`)
-   Each message has a unique client offset to prevent duplicates
-   Clients automatically receive missed messages on reconnection
-   Use the "Disconnect/Connect" button to test reconnection features

## Tech Stack

-   **Backend**: Node.js, Express, Socket.IO
-   **Database**: SQLite
-   **Frontend**: Vanilla JavaScript, HTML, CSS
