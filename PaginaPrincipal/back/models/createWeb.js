import mongoose from "mongoose";

const createWebSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  theme: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  // Campo para el WhatsApp del Creador
  whatsappCreator: {
    type: String,
    required: true,
    trim: true,
    set: (val) => {
      if (!val) return val;
      // Extrae solo los dígitos numéricos
      const cleanNumber = val.replace(/\D/g, '');
      // Asegura el prefijo https://wa.me/
      return `https://wa.me/${cleanNumber}`;
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

createWebSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const CreateWeb = mongoose.model('CreateWeb', createWebSchema);

export default CreateWeb;