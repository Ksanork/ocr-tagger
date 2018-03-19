import mongoose from 'mongoose';

const DatasetSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

const Dataset = mongoose.model('Dataset', DatasetSchema);
export default Dataset;