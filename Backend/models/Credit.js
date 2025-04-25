const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  compteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Compte',
    required: true
  },
  type: { 
    type: String,
    enum: ['Auto', 'Immobilier', 'Études', 'Liquidité'],
    required: true
  },
  montant: { 
    type: Number, 
    required: true 
  },
  duree: { 
    type: Number, 
    required: true 
  },
  RevenuMensuel: {
    type: Number,
    required: true
  },
  tauxInteret: Number,
  mensualite: Number,
  dateDebut: Date,
  dateFin: Date,
  status: {
    type: String,
    enum: ['received', 'pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Credit', creditSchema);