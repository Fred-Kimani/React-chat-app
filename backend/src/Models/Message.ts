// models/Message.ts
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  
}, { timestamps: true });

// Indexes
messageSchema.index({ roomId: 1, createdAt: 1 }); // most important
messageSchema.index({ sender: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
