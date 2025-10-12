const express = require('express');
const CV = require('../models/CV');
const auth = require('../middleware/auth');

const router = express.Router();

// GET - Tous les CVs de l'utilisateur
router.get('/my-cvs', auth, async (req, res) => {
  try {
    const cvs = await CV.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(cvs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET - Un CV spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    if (!cv) return res.status(404).json({ message: 'CV non trouvé' });
    res.json(cv);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST - Créer un nouveau CV
router.post('/', auth, async (req, res) => {
  try {
    const cvData = {
      ...req.body,
      user: req.user._id
    };
    
    const newCV = await CV.create(cvData);
    res.status(201).json(newCV);
  } catch (error) {
    console.error('Erreur création CV:', error);
    res.status(400).json({ message: 'Données invalides' });
  }
});

// PUT - Mettre à jour un CV
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedCV = await CV.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCV) return res.status(404).json({ message: 'CV non trouvé' });
    res.json(updatedCV);
  } catch (error) {
    console.error('Erreur mise à jour CV:', error);
    res.status(400).json({ message: 'Données invalides' });
  }
});

// DELETE - Supprimer un CV
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedCV = await CV.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedCV) return res.status(404).json({ message: 'CV non trouvé' });
    res.json({ message: 'CV supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;