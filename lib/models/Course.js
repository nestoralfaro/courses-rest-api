// require('../db');
const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    subject: {
        type: String,
        minlength: [4, 'Must be 4 characters long, got {VALUE}'],
        maxlength: [4, 'Must be 4 characters long, got {VALUE}'],
        uppercase: true,
        required: true,
    },
    number: {
        type: Number,
        min: [1000, 'Must be minimum 1000, got ${VALUE}'],
        max: [6999, 'Must be maximum 6999, got ${VALUE}'],
        validate: {
            validator: v => v == Math.trunc(v),
            message: '{VALUE} is not an integer',
        },
        required: true,
    },
    title: {
        type: String,
        trim: true,
        maxlength: [200, 'Must be at most 200 characters long, got ${VALUE}'],
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    students: {
        type: [{
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                ref: 'User',
            }
        ],
        default: [],
    }
}, {
    toJSON: {
            getters: false,
            virtuals: false,
            transform: (doc, obj, options) => {
                obj.id = obj._id.toString();
                // obj.teacher = obj.teacher.toString();
                // if (obj.students)
                //     obj.students = obj.students.map(student => student.toString());
                delete obj._id;
                delete obj.__v;
                return obj;
            }
        }
    }

)
//For each course, the combination of subject-number must be unique
.index({subject: 1, number: 1}, {unique: true});

const Course = mongoose.model('Course', CourseSchema);
module.exports = { Course };