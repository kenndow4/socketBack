import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const MessageModel = mongoose.model<IMessage>('Message', messageSchema);

export default MessageModel;