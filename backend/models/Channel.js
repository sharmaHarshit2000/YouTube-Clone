import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true }, 
  channelName: { type: String, required: true },
  description: { type: String },
  channelBanner: { type: String },
  bannerPublicId: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },// Store the refrence of User
  subscribers: { type: Number, default: 0 },
  subscribersList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
}, { timestamps: true });


export default mongoose.model('Channel', channelSchema);
