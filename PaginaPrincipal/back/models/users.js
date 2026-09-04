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
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

const User = mongoose.model('User', userSchema);

export default User;