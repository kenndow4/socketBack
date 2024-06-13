


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
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

// Ruta principal que envía un mensaje <h1> al navegador
app.get('/', (req, res) => {
  res.send('<h1>Bienvenido al servidor yeah!</h1>');
});

io.on('connection', async (socket: Socket) => {
  console.log(`Usuario conectado desde la dirección IP: ${socket.handshake.address}`);

  try {
    // Obtener los últimos 15 mensajes ordenados por fecha de creación
    const messages = await MessageModel.find().limit(15).sort({ createdAt: -1 });
    socket.emit('messages', messages.reverse());
  } catch (error) {
    console.error('Error al buscar mensajes:', error);
  }

  socket.on('message', async (data: IMessage) => {
    const ipAddress = socket.handshake.address; // Obtener la dirección IP del cliente
    const messageData = { ...data, ip: ipAddress }; // Agregar la dirección IP al objeto de mensaje
    const message = new MessageModel(messageData);
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

