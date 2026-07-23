import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scannedImageUrl: { type: String, default: "" },
  doctorName: { type: String, default: "" },
  patientName: { type: String, default: "" },
  dateIssued: { type: Date, default: Date.now },
  medications: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      matchedName: { type: String, default: "" },
      dosageInstructions: { type: String, default: "" },
      quantity: { type: Number, default: 1 }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prescription', prescriptionSchema);
