import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    // Match User _id which is a String (Clerk userId)
    user: {type: String, ref: 'User', required: true},
    content: {type: String},
    media_url: {type: String},
    media_type: {type: String, enum: ['text', 'image', 'video']},
    // Keep views_count as String refs to User as well
    views_count: [{type: String, ref: 'User'}],
    background_color: { type: String },
}, {timestamps: true, minimize: false})

const Story = mongoose.model('Story', storySchema)

export default Story;   