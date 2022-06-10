# RESTFUL API COMP4310

This restful API handles the following services for a user (taken from [Dr. Foust's project description](https://cs.harding.edu/gfoust/classes/comp4310/projects/api)):

## Instructions to execute
To execute it on your local machine, clone the repository and run.
- `npm install` to install the necessary APIs for the application.
- `npm run start` to start the server which should be listening on port `8000` or as specified on `lib/config.js`.
- Requires a MongoDB server.

## Services

#### User

Services:

- `GET /api/users` — return a list of all users (only populates `id` and `username`)
- `GET /api/users/:userid` — get a specific user (populates all fields)
- `POST /api/users` — create a new user
- `PUT /api/users/:userid` — update a specific user
- `DELETE /api/users/:userid` — delete a specific user

Rules:

- The `:userid` parameter may be either a document `id` or a `username`.
- When updating, the client cannot modify the document `id`.
- A user cannot be deleted if it is a teacher or a student for any courses.

#### Courses

Services:

- `GET /api/courses` — return a list of all courses (only populates `id`, `subject`, and `number`).
- `GET /api/courses/:courseid` — get a specific course (populates all fields except `students`).
- `GET /api/courses/users/:userid` — get all courses for which specified user is teacher, and all courses for which specified user is student (only populates `id`, `subject`, and `number`).
- `POST /api/courses` — create a new course.
- `PUT /api/courses/:courseid` — update a specific course.
- `DELETE /api/courses/:courseid` — delete a specific course.

Rules:

- The :courseid may be either a document `id` or a `subject` and `number` concatenation (e.g., "`comp4310`"). The subject is case insensitive.
- When creating or updating, the teacher field may be either a document `id` or a `username`.
- When retrieving courses, teacher is populated with `id`, `firstname`, and `lastname` only.
- These services basically ignore the students field: they do not return it on a read nor do they write to it on an update or a create.
- When updating, the client cannot modify the document `id`.
- The service to retrieve all courses for a user returns an object with two properties (e.g., `{teacher: courselist, student: courselist}`).
- (Missing) Course cannot be deleted if it has any assignments.

#### Students in class

Services:

- `GET /api/rosters/:classid` — return a list of all students for a particular class (populates all fields).
- `PUT /api/rosters/:classid/:userid` — add student to class.
- `DELETE /api/rosters/:classid/:userid` — remove student from class.

Rules:

- The `:classid` parameter is the same as in the class web services.
- The `:userid` parameter is the same as in the user web services.
- The `PUT` and `DELETE` services should return only the userid of the student that was just added or removed.
- Note that none of these services have any content in the body of the request; all necessary information is available in the URL.

## Technologies used

- Mongoose and MongoDB
- Nodejs
- Express
