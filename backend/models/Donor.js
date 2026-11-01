const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { 
    type: String, 
    enum: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    required: true 
  },
  phone: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
}, { timestamps: true });

donorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donor', donorSchema);