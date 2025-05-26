// auth.ts
import express, {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../Models/User.ts";
const JWT_SECRET = process.env.JWT_SECRET!;
// challenge: use oauth2 as well


const router = express.Router(); // Initialize the express router

// Define routes and map them to controller functions
router.post("/register", async (req: Request, res: Response) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;
  
    try {
      // Check if all fields are provided
      if (!email || !firstName || !lastName || !password || !confirmPassword) {
        console.log('Error: Missing required fields');
         res.status(400).json({ error: 'All fields are required.' });
         return;
      }
  
      // Check if passwords match
      if (password !== confirmPassword) {
        console.log('Error: Passwords do not match');
         res.status(400).json({ error: 'Passwords do not match.' });
         return;
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`Error: User with email ${email} already exists`);
         res.status(400).json({ message: 'A user with this email already exists' });
         return;
      }
  
      // Hash the password and create the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
  
      // Send success response with user info and token
      console.log('User registered successfully:', newUser);
      res.status(201).json({
        message: 'User registered successfully.',
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      });
  
    } catch (error) {
      // Log error and send internal server error response
      console.error('Internal server error:', error);
       res.status(500).json({ message: 'Internal server error' });
       return;
    }

}); // Use registerUser for /register endpoint

export default router; // Export router to be used in your app
