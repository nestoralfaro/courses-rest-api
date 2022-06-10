// require('../db');
const mongoose = require('mongoose');

const AssignmentSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    due: {
        type: Date,
        validate: {
            validator: v => Date.parse(v) !== NaN,
            message: props => `${props.value} cannot be parsed. Not valid`,
        },
        required: true,
        set: v => Date.toLocaleString(v),

    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        //must be an existing course,
        ref: 'Course',
        required: true,
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
            }
        }
    }
);

const Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = { Assignment };