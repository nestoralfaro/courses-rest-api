const { default: mongoose } = require('mongoose');
const { User } = require('../../models/User');
const { Course } = require('../../models/Course');
const { notFound } = require('../common');

async function queryUser (req, res, next, userId) {
    try {
        if (userId.length === 24) {
            //this user has been queried by its document id (given that MongoDB IDs are 24 characters long)
            res.locals.user = await User.findById(userId);
        } else {
            //it is very likely that this user has been queried by its username
            res.locals.user = await User.findOne({
                username: userId,
            });
        }
        if (res.locals.user) next();
        else notFound(req, res);
    } catch (error) {
        next(error);
    }
}

async function getUsers (req, res, next) {
    try {
            //id will always be returned
            //either way of querying only the username should work
            //let users = await User.find({}, {'username': 1});
            let users = await User.find().select('username');
           res.json(users);
    } catch (error) {
        next(error);
    }
}

function getUser(req, res, next) {
    res.json(res.locals.user);
}

async function createUser(req, res, next) {
    try {
        const user = new User({
                id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            },
        );
        await user.save();
        user.id = undefined;
        res.status(200);
        res.json(user);
    } catch (error) {
        next(error);   
    }
}

async function updateUser(req, res, next) {
    try {
        let user = res.locals.user;
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;

        await user.save();
        res.status(200);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function isInCourse (user) {
    try {
        const courses = await Course.find()
                        .populate('teacher students')
                        .exec();
        if (courses) {
            //Find the course where user is
            return courses.some(course => {
                const teacher = course.teacher;
                const students = course.students;
                return (
                //Either a teacher
                (user.equals(teacher)) ||
                //Or a student
                (students.some(student => user.equals(student)))
            )})
        } else {
            //Since there are no courses, then the user is probably not in a course
            return false;
        }
    } catch (error) {
        throw(error);   
    }
}

async function deleteUser(req, res, next) {
    try {
        if (await isInCourse(res.locals.user)) {
            throw ({name: 'DependentResource', message: 'Other resources depend on this resource.'})
        } else {
            let user = res.locals.user;
            await user.remove();
            res.status(200);
            res.json(user);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    queryUser,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};