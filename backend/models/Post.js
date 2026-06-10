const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username:  { type: String, required: true },
  avatar:    { type: String, required: true },
  content:   { type: String, required: true },
  likes:     { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

postSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Post', postSchema);
