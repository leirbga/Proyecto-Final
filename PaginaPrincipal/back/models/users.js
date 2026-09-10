import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  verified: {
    type: Boolean,
    default: false
  },
  dev: {
    type: Boolean,
    default: false
  },

  carrito: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreateWeb'
  }],
  
  buys: [{
    webPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreateWeb'
    },
    title: String,
    pricePaid: Number,
    purchasedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true // Agrega automáticamentecreatedAt y updatedAt al crear/actualizar
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    
    // Formatea la fecha de creación a un string legible (ej. "2026-03-30") o solo el año según prefieras
    if (returnedObject.createdAt) {
      returnedObject.joinedAt = returnedObject.createdAt.toISOString().split('T')[0];
    }

    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

const User = mongoose.model('User', userSchema);

export default User;