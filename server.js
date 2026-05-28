const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { loadEnvConfig } = require("@next/env");

const dev = process.env.NODE_ENV !== "production";
loadEnvConfig(process.cwd(), dev);
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join room based on user role or ID
    socket.on("join", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // Attendance Events
    socket.on("attendance:submit", (data) => {
      // Broadcast to admins
      io.to("ADMIN").emit("attendance:class:submitted", data);
    });

    socket.on("attendance:absent", (data) => {
      // Send to specific parent
      if (data.parentId) {
        io.to(`PARENT_${data.parentId}`).emit("child:absent", data);
      }
      // Send to specific student
      if (data.studentId) {
        io.to(`STUDENT_${data.studentId}`).emit("attendance:updated", data);
      }
    });
    
    socket.on("attendance:detain", (data) => {
      if (data.studentId) {
        io.to(`STUDENT_${data.studentId}`).emit("student:detained", data);
      }
      if (data.parentId) {
        io.to(`PARENT_${data.parentId}`).emit("child:detained", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
