const { Course } = require('../../models/Course');
const { default: mongoose } = require('mongoose');
const { User } = require('../../models/User');
const { notFound } = require('../common');

async function lookUpCourse (res, courseId) {
    //Code hint by Dr. Foust
    //if courseId cannot be matched, then it was not provided.
    let match = courseId.match(/^([a-zA-Z]{4})(\d{4})$/);
    if (match) {
        //the course has been queried by a subject-number pair
        res.locals.course = await Course.findOne({
            subject: match[1].toUpperCase(),
            number: Number(match[2]),
        })
        .populate('teacher students')
        .exec();    
    }
    else {
        //else the course has been queried by its document id
        res.locals.course = await Course.findById(courseId)
        .populate('teacher students')
        .exec();
    }
}
                //more like filter course?
async function queryCourse (req, res, next, courseId) {
    try {
        await lookUpCourse(res, courseId);
        if (res.locals.course) next();
        else notFound(req, res);
    } catch (error) {
        next(error);
    }
}

function getCourse(req, res, next) {
    res.status(200);
    res.json({
        id: res.locals.course.id,
        number: res.locals.course.number,
        subject: res.locals.course.subject,
        title: res.locals.course.title,
        teacher: {
            id: res.locals.course.teacher.id,
            firstname: res.locals.course.teacher.firstname,
            lastname: res.locals.course.teacher.lastname
        }
    });
}

async function getCourses (req, res, next) {
    try {
        let courses = await Course.find({})
        .select('id subject number')
        .exec();
        res.json(courses);
    } catch (error) {
        next(error)
    }
}

async function getCoursesForUser (req, res, next) {
    // get all courses for which specified user is teacher,
    //and all courses for which specified user is student
    //(only populate id, subject, and number
    
    // The service to retrieve all courses for a user should
    //return an object with two properties:
    //{teacher: courselist, student: courselist}
    try {
        //Get all courses and populate their teacher and students fields
        let courses = await Course.find()
        .populate('teacher students')
        .exec();

        let formatCourseJson = course => ({'id': course.id, 'subject': course.subject, 'number': course.number});

        res.json({
            //In what course is user a teacher?
            teacher: courses.filter(course => course.teacher.id == (res.locals.user.id)).map(formatCourseJson),
            //In what course is user a student?
            students: courses.filter(course => course.students.find(student => student.id == (res.locals.user.id))).map(formatCourseJson),
        });

    } catch (error) {
        next(error)
    }
}

function isAnExistingUser (userId, users) {
    return users.some(user => user.id === userId);
}

async function createCourse(req, res, next) {
    try {
        const users = await User.find();
        //check if teacher is an existing user
        if (isAnExistingUser(req.body.teacher, users)) {
            //if adding students
            let course;
            if (req.body.students) {
                //check if all the students are existing users
                if (req.body.students.every(student => isAnExistingUser(student, users))) {
                    course = new Course({
                        id: new mongoose.Types.ObjectId(),
                        subject: req.body.subject,
                        number: req.body.number,
                        title: req.body.title,
                        teacher: mongoose.Types.ObjectId(req.body.teacher),
                        students: req.body.students,
                    });
                } else {
                    throw({name: 'CourseValidationFailed', message: `At least one student is not an existing user`});
                }
            }
            else {
                course = new Course({
                    id: new mongoose.Types.ObjectId(),
                    subject: req.body.subject,
                    number: req.body.number,
                    title: req.body.title,
                    teacher: mongoose.Types.ObjectId(req.body.teacher),
                });
            }
            await course.save();
            const resCourse = await Course.findById(course.id)
                                .populate('teacher', 'id firstname lastname')
                                .exec();
            res.status(200);
            res.json({
                id: resCourse.id,
                subject: resCourse.subject,
                number: resCourse.number,
                title: resCourse.title,
                teacher: resCourse.teacher
            });
        } else {
            // throw({name: 'CourseValidationFailed', message: `The teacher with ID: ${req.body.teacherId} was not found.`});
            throw({name: 'CourseValidationFailed', message: `Teacher is a required field`});
        }
    } catch (error) {
        next(error);   
    }
}
async function updateCourse(req, res, next) {
    try {
        let course = res.locals.course;
        course.subject = req.body.subject;
        course.number = req.body.number;
        course.title = req.body.title;
        course.teacher = req.body.teacher;
        await course.save();
        let resCourse = await Course.findById(course.id).select('-students').populate('teacher', 'id firstname lastname');
        res.json(resCourse);
    } catch (error) {
        next(error);   
    }
}
async function deleteCourse(req, res, next) {
    try {
        // (Optional) Do not allow a course to be deleted if it has any assignments.
        // let courseHasAssignments = await Assignment.find({
        //     course: res.locals.course
        // }).populate('course');
        // if (courseHasAssignments){
            // throw {name: "DependentResource", message: 'Other resources depend on this resource.'}
        // } else {
            let course = res.locals.course;
            // let newCourseList = res.locals.course.filter(course => !(course.id.equals()))
            await Course.deleteOne({id: course.id});
            course.teacher.username = undefined;
            course.students = undefined;
            res.json(course);
        // }
    } catch (error) {
        next(error);   
    }
}

module.exports = {
    lookUpCourse,
    queryCourse,
    getCourse,
    getCourses,
    getCoursesForUser,
    createCourse,
    updateCourse,
    deleteCourse,
};