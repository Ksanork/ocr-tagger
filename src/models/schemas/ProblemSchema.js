import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
    description: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
});


const Problem = mongoose.model('Problem', ProblemSchema);

// Problem.create()

export default Problem;