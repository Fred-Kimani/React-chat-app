import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }

}, {timestamps: true})

// Indexes
userSchema.index({ email: 1 }, { unique: true }); // fast email lookups
userSchema.index({ username: "text", email: "text" }); // for text search bar


const User = mongoose.model('User', userSchema)
export default User;