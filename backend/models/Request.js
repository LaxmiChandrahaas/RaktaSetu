const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodGroup: { 
    type: String, 
    enum: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    required: true 
  },
  unitsRequired: { type: Number, default: 1 },
  urgency: { 
    type: String, 
    enum: ['Critical', 'Urgent', 'Moderate'], 
    default: 'Urgent' 
  },
  hospital: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Open', 'Matched', 'Fulfilled', 'Cancelled'], 
    default: 'Open' 
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
}, { timestamps: true });

requestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Request', requestSchema);