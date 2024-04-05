// import { createServer, Server as HTTPServer } from "http";
// import { Server as SocketIOServer, Socket } from "socket.io";
// import cors from 'cors';

// const httpServer: HTTPServer = createServer();
// const io: SocketIOServer = new SocketIOServer(httpServer, {
//   // options
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // Escuchamos el evento "connection" para manejar las conexiones de los clientes
// io.on("connection", (socket: Socket) => {
//   // Enviamos un mensaje de bienvenida al cliente que se ha conectado
//   socket.emit("message", "¡Bienvenido al servidor de Socket.IO!");

//   // Mostramos un mensaje en la consola del servidor cuando un cliente se conecta
//   console.log("Cliente conectado");

//   // Escuchamos el evento "message" desde el cliente y mostramos el mensaje recibido en la consola del servidor
//   socket.on("message", (data: string) => {
//     console.log("Mensaje recibido del cliente:", data);
//   });
// });

// // Escuchamos el evento "listening" del servidor HTTP para obtener el puerto en el que está escuchando
// httpServer.on("listening", () => {
//   const addr = httpServer.address();
//   const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
//   console.log("Servidor HTTP escuchando en " + bind);
// });

// // Ponemos a escuchar el servidor HTTP en el puerto 4000
// httpServer.listen(4000);


// import { createServer, Server as HTTPServer } from "http";
// import { Server as SocketIOServer, Socket } from "socket.io";
// import cors from 'cors';

// const httpServer: HTTPServer = createServer();
// const io: SocketIOServer = new SocketIOServer(httpServer, {
//   // options
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // Escuchamos el evento "connection" para manejar las conexiones de los clientes
// io.on("connection", (socket: Socket) => {
//   // Enviamos un mensaje de bienvenida al cliente que se ha conectado
//   socket.emit("message", "¡Bienvenido al servidor de Socket.IO!");

//   // Mostramos un mensaje en la consola del servidor cuando un cliente se conecta
//   console.log("Cliente conectado");

//   // Escuchamos el evento "message" desde el cliente y mostramos el mensaje recibido en la consola del servidor
//   socket.on("message", (data: string) => {
//     console.log("Mensaje recibido del cliente:", data);
//     // Emitimos el mensaje recibido a todos los clientes conectados, incluyendo al cliente que lo envió
//     io.emit("message", data);
//   });
// });

// // Escuchamos el evento "listening" del servidor HTTP para obtener el puerto en el que está escuchando
// httpServer.on("listening", () => {
//   const addr = httpServer.address();
//   const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
//   console.log("Servidor HTTP escuchando en " + bind);
// });

// // Ponemos a escuchar el servidor HTTP en el puerto 4000
// httpServer.listen(4000);



// server.ts

// server.ts

// server.ts

// server.ts


import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import mongoose, { Document, Schema, Model } from 'mongoose';
import cors from 'cors';

interface IMessage extends Document {
  text: string;
  createdAt: Date;
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000", // Permitir solicitudes desde este origen
    methods: ["GET", "POST"] // Métodos permitidos
  }
});

mongoose.connect("mongodb+srv://monk:juventus@cluster0.rocdkbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// Configura CORS en Express también
app.use(cors());

const messageSchema = new Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

io.on('connection', async (socket: Socket) => {
  console.log('Usuario conectado');

  try {
    // Obtener los últimos 10 mensajes ordenados por fecha de creación
    const messages = await MessageModel.find().limit(10).sort({ createdAt: -1 });
    socket.emit('messages', messages.reverse());
  } catch (error) {
    console.error('Error al buscar mensajes:', error);
  }

  socket.on('message', async (data: IMessage) => {
    const message = new MessageModel(data);
    try {
      await message.save();
      io.emit('message', message);
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(4000, () => {
  console.log('Servidor escuchando en el puerto 4000');
});

