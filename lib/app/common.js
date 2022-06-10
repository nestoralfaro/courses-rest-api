function notFound(req, res, next) {
    res.status(404);
    res.json({message: `The resource ${req.originalUrl} was not found.`});
}

function internalError(err, req, res, next) {
    if (err.name === 'SyntaxError') {
        res.status(400);
        res.json({message: err.message});
    }
    else if (err.name === 'ValidationError'){
        res.status(400);
        res.json({message: err.message});
    }
    else if (err.name === 'MongoServerError'){
        //Handle MongoServerErrors
        if (err.code === 11000) {
            res.status(400);
            res.json({message: err.message});
        }
    }
    else if (err.name === 'DependentResource'){
        res.status(400);
        res.json({message: err.message});
    }
    else if (err.name === 'StudentAlreadyExists') {
        res.status(400);
        res.json({message: err.message});
    }
    else if (err.name === 'CourseValidationFailed') {
        res.status(400);
        res.json({message: err.message});
    }
    else if (err.name === 'IsNotAStudentInCourse') {
        res.status(400);
        res.json({message: err.message});
    }
    else {
        console.log('Server Error:');
        console.log(err);
        res.status(500);
        res.json({message: 'The server encountered an unexpected error.'});
        //Optional json response to an 'unexpected error'
        //res.json({message: `The server encountered ${err.name || 'an unexpected'} error.`});
    }
}

function serviceNotSupported(req, res) {
    res.status(405);
    res.json({message: `The resource ${req.originalUrl} does not support ${req.method} requests.`});
}

module.exports = {
    notFound,
    internalError,
    serviceNotSupported,
};