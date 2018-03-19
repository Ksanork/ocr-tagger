import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin:  {
        type: Boolean,
        default: false,
        required: true
    }
});

// hashowanie hasła
UserSchema.pre('save', function(next) {
    let user = this;

    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

const User = mongoose.model('User', UserSchema);
export default User;