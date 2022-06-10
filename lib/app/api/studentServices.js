const { lookUpCourse } = require('./courseServices');

//Service for /api/rosters/:classid
//return a list of all students for a particular class
//(populate all fields)
async function studentsInCourse(req, res, next) {
    try {
        await lookUpCourse(res, req.params.courseId);
        res.json(
            res.locals.course.students
            .map(student => ({
                id: student.id,
                username: student.username
            }))
        );
    } catch (error) {
        next(error);
    }
}

//Service for /api/rosters/:courseId/:userId
async function addStudentToCourse (req, res, next) {
    try {
        let newStudentsList = res.locals.course.students;
        if (newStudentsList.find(student => student.id == (res.locals.user.id))) {
            throw({
                name: 'StudentAlreadyExists',
                message: `${res.locals.user.firstname} ${res.locals.user.lastname} is already a student in ${res.locals.course.subject}${res.locals.course.number}`
            });
        }
        else {
            newStudentsList.push(res.locals.user);
        }
        await res.locals.course.save();
        res.json(res.locals.user.id);
    } catch (error) {
        next(error);
    }

}

//Service for /api/rosters/:courseId/:userId
async function removeStudentFromCourse (req, res, next) {
    try {
        if (!res.locals.course.students.some(student => student.id == (res.locals.user.id))) throw ({
            name: 'IsNotAStudentInCourse', 
            message: `${res.locals.user.firstname} ${res.locals.user.lastname} is not a student in ${res.locals.course.subject}${res.locals.course.number}`
        });
        res.locals.course.students = res.locals.course.students.filter(student => !(student.id == (res.locals.user.id)));
        await res.locals.course.save();
        res.json(res.locals.user.id);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    studentsInCourse,
    addStudentToCourse,
    removeStudentFromCourse,
}