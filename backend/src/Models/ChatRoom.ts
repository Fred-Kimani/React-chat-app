// models/ChatRoom.ts
import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return !this.isPrivate;
    }
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return !this.isPrivate;
    }
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  someField: {
    type: String,
    default: 'placeholder'
  }
}, { timestamps: true });


// Indexes
chatRoomSchema.index({ isPrivate: 1, name: 1 });
chatRoomSchema.index({ allowedUsers: 1 });


const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
export default ChatRoom;
