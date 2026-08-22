// import mongoose from 'mongoose';

// const carritoSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   webPost: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'CreateWeb',
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   image: String,
//   description: String,
//   theme: String,
//   url: String
// }, {
//   timestamps: true
// });

// carritoSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   }
// });

// const Carrito = mongoose.model('Carrito', carritoSchema);

// export default Carrito;