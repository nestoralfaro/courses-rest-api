//Tools
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const common = require('../common');
//Import middleware for each model
const usrQry = require('./userServices');
const crsQry = require('./courseServices');
const stdQry = require('./studentServices');

//Maybe not necesasry since it is already parsing on server.js?
router.use(bodyParser.json());

/*****************************************************
Endpoints for User documents
******************************************************/
router.param('userId', usrQry.queryUser);

// get all users (only populate id and username)
router.get('/users', usrQry.getUsers);
// create a new user
router.post('/users', usrQry.createUser);
router.all('/users', common.serviceNotSupported);

// get a specific user
router.get('/users/:userId', usrQry.getUser);
// update a specific user
router.put('/users/:userId', usrQry.updateUser);
// delete a specific user
router.delete('/users/:userId', usrQry.deleteUser);
router.all('/users/*', common.serviceNotSupported);

/*****************************************************
Endpoints for Course documents
******************************************************/
router.param('courseId', crsQry.queryCourse);

// get all courses (only populate id, subject, and number)
router.get('/courses', crsQry.getCourses);
// create new course
router.post('/courses', crsQry.createCourse);
router.all('/courses', common.serviceNotSupported);

// get a specific course
router.get('/courses/:courseId', crsQry.getCourse);
// update a specific course
router.put('/courses/:courseId', crsQry.updateCourse);
// delete a specific course
router.delete('/courses/:courseId', crsQry.deleteCourse);

// get all courses for which specified user is teacher, 
// and all courses for which specified user is student 
// (only populate id, subject, and number)
router.get('/courses/users/:userId', crsQry.getCoursesForUser);
router.all('/courses/*', common.serviceNotSupported);

/*****************************************************
Endpoints for interacting with students in a class
******************************************************/
// return a list of all students for a particular class (populate all fields)
router.get('/rosters/:courseId', stdQry.studentsInCourse);
// add student to class
//  should return only the userid of the student that was just added or removed
router.put('/rosters/:courseId/:userId', stdQry.addStudentToCourse);
// remove student from class.
//  should return only the userid of the student that was just added or removed
router.delete('/rosters/:courseId/:userId', stdQry.removeStudentFromCourse);
router.all('/rosters/*', common.serviceNotSupported);

router.use(common.notFound);
router.use(common.internalError);
module.exports = {router};