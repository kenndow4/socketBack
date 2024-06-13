

import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import mongoose, { Document, Schema, Model } from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

interface IMessage extends Document {
  text?: string;
  audioUrl?: string;
  ip: string;
  createdAt: Date;
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
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
app.use('/uploads', express.static('uploads'));

const messageSchema = new Schema({
  text: String,
  audioUrl: String,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido al servidor yeah!</h1>');
});

io.on('connection', async (socket: Socket) => {
  console.log(`Usuario conectado desde la dirección IP: ${socket.handshake.address}`);

  try {
    const messages = await MessageModel.find().limit(15).sort({ createdAt: -1 });
    socket.emit('messages', messages.reverse());
  } catch (error) {
    console.error('Error al buscar mensajes:', error);
  }

  socket.on('message', async (data: Partial<IMessage>) => {
    const ipAddress = socket.handshake.address;
    const messageData = { ...data, ip: ipAddress };
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

app.post('/upload', upload.single('audio'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  res.status(200).json({ audioUrl: `/uploads/${file.filename}` });
});

server.listen(4000, () => {
  console.log('Servidor escuchando en el puerto 4000');
});
