const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // A dummy user check
  if (email === 'demo@eyeheat.com' && password === 'demo123') {
    return res.json({ token: 'mock-jwt-token-12345', message: 'Success' });
  }
  
  return res.status(401).json({ message: 'Invalid email or password.' });
});

module.exports = router;
