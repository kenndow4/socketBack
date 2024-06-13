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
  ip: string;
  createdAt: Date;
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

mongoose.connect("mongodb+srv://monk:juventus@cluster0.rocdkbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

app.use(cors());
app.use(express.json());

const messageSchema = new Schema({
  text: String,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido al servidor yeah!</h1>');
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await MessageModel.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).send('Error al obtener mensajes');
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const messageData = req.body;
    const message = new MessageModel(messageData);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).send('Error al crear mensaje');
  }
});

app.put('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const message = await MessageModel.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).send('Error al actualizar mensaje');
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await MessageModel.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Error al eliminar mensaje');
  }
});

io.on('connection', (socket: Socket) => {
  console.log(`Usuario conectado desde la dirección IP: ${socket.handshake.address}`);

  socket.on('signal', (data) => {
    socket.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(4000, () => {
  console.log('Servidor escuchando en el puerto 4000');
});
