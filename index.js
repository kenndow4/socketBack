"use strict";
// import { createServer, Server as HTTPServer } from "http";
// import { Server as SocketIOServer, Socket } from "socket.io";
// import cors from 'cors';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importStar(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000", // Permitir solicitudes desde este origen
        methods: ["GET", "POST"] // Métodos permitidos
    }
});
mongoose_1.default.connect("mongodb+srv://kendowcent:Juventus@cluster0.rocdkbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
})
    .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
});
// Configura CORS en Express también
app.use((0, cors_1.default)());
const messageSchema = new mongoose_1.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }
});
const MessageModel = mongoose_1.default.model('Message', messageSchema);
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Usuario conectado');
    try {
        // Obtener los últimos 10 mensajes ordenados por fecha de creación
        const messages = yield MessageModel.find().limit(10).sort({ createdAt: -1 });
        socket.emit('messages', messages.reverse());
    }
    catch (error) {
        console.error('Error al buscar mensajes:', error);
    }
    socket.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const message = new MessageModel(data);
        try {
            yield message.save();
            io.emit('message', message);
        }
        catch (error) {
            console.error('Error al guardar mensaje:', error);
        }
    }));
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
}));
server.listen(4000, () => {
    console.log('Servidor escuchando en el puerto 4000');
});
