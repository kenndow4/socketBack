import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  ip:string;
  createdAt: string; // Cambiado a string en lugar de Date
}

const messageSchema = new Schema({
  text: String,
  ip:String,
  createdAt: { type: String, default: () => {
    const date = new Date();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${day}/${month} ${hours}:${minutes}`;
  }}
});

const MessageModel = mongoose.model<IMessage>('Message', messageSchema);

export default MessageModel;
