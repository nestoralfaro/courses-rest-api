// require('../db');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        // match: /^[a-zA-Z\d]+$/,
        validate: {
            //Regex provided by Dr. Foust
            validator: v => /^[a-zA-Z\d]+$/.test(v),
            message: '{VALUE} username must be only alphanumeric characters',
        },
        minlength: [4,'Username must be at least 4 characters long, got {VALUE}'],
        maxlength: [20, 'Username must be at most 20 characters long, got {VALUE}'],
        unique: true,
        required: [true, 'User username is required'],
    },
    firstname: {
        type: String,
        trim: true,
        maxlength: [100, 'User first name must be at most 100 characters long, got {VALUE}'],
        required: [true, 'User first name is required'],
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: [100, 'User last name must be at most 100 characters long, got {VALUE}'],
        required: [true, 'User last name must be 4 characters long, got {VALUE}'],
    },
    email: {
        type: String,
        validate: {
            validator: v => /^\w+@\w+(\.\w+)+$/.test(v),
            message: props => `${props.value} is not a valid email.`,
        },
        optional: true,
        unique: true,
        default: undefined,
        sparse: true,
    }
}, {
    toJSON: {
        getters: false,
        virtuals: false,
        transform: (doc, obj, options) => {
                // obj.id = obj._id.valueOf();
                obj.id = obj._id.toString();
                delete obj._id;
                delete obj.__v;
                return obj;
            },
        }
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = { User };