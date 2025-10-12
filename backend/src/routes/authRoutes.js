const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Connexion/Inscription avec Google
router.post('/google', async (req, res) => {
  try {
    const { token, credentials } = req.body;
    
    if (!token || !credentials) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    let user = await User.findOne({ 
      $or: [
        { email: credentials.email },
        { googleId: credentials.userId }
      ]
    });

    if (!user) {
      user = await User.create({
        email: credentials.email,
        name: credentials.name,
        googleId: credentials.userId,
        avatar: credentials.picture
      });
    } else {
      user.googleId = credentials.userId;
      user.avatar = credentials.picture;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Connexion réussie',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Erreur auth Google:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion/Inscription avec LinkedIn
router.post('/linkedin', async (req, res) => {
  try {
    const { token, provider } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token manquant' });
    }

    const user = await User.findOneAndUpdate(
      { linkedinId: token },
      {
        email: `linkedin-${token}@example.com`,
        name: 'Utilisateur LinkedIn',
        linkedinId: token
      },
      { upsert: true, new: true }
    );

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Connexion LinkedIn réussie',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Erreur auth LinkedIn:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer le profil utilisateur
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });

  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
});

module.exports = router;