import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../Models/User'; // adjust to your user model path

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
     res.status(401).json({ message: 'Invalid email or password' });
     return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password' });
    return
}

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.json({ message: 'Logged in successfully' });
});

// Me route
router.get('/me', (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
}

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('access_token', { path: '/' });
  res.json({ message: 'Logged out' });
});

export default router;
