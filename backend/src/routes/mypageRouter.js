const express = require('express');
const router = express.Router();
const userService = require('../services/mypageService');

router.get('/mypage', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  const userId = req.user.user_id;
  try {
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user information' });
  }
});

module.exports = router;