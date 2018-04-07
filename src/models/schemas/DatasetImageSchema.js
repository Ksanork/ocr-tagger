import mongoose from 'mongoose';

const DatasetImageSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    dataset: {
        type: String
    },
    tag: {
        type: String,
        default: ''
    },
    taggedBy: {
        type: String,
        default: ''
    },
    problem: {
        type: String,
        default: ''
    }
});

const DatasetImage = mongoose.model('DatasetImage', DatasetImageSchema);
export default DatasetImage;