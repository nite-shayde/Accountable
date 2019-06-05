const express = require('express');

const port = process.env.SERVER_PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const db = require('../database/index');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/dist')));


/**
 * Post request handler that creates class in database with
 * className and teacherId from client request
 * @param {string} '/classes' - endpoint for post request
 * @param {function} - express callback function
 */

app.post('/classes', (req, res) => {
  db.models.Classes.create({
    name: req.body.className,
    teacherID: req.body.id || 1,
  })
    .then(() => {
      console.log('class saved in database successfully');
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('Error saving new class to database', err);
      res.sendStatus(500);
    });
});

/**
 * Post request handler that creates student in database with
 * name, parentName, phone, email, and classID form request body
 * @param {string} '/students' - endpoint for post request
 * @param {function} - express callback function
 */

app.post('/students', (req, res) => {
  db.models.Students.create({
    name: req.body.name,
    parentName: req.body.parentName,
    phone: req.body.phone,
    email: req.body.email,
    classID: req.body.classID,
  })
    .then(() => {
      console.log('Student data saved in database successfully');
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('error saving student data in database', err);
      res.sendStatus(500);
    });
});

/**
 * Post request handler that creates comment in database with
 * comment text and studentID from request body
 * @param {string} '/students' - endpoint for post request
 * @param {function} - express callback function
 */

app.post('/comments', (req, res) => {
  db.models.Comments.create({
    studentID: req.body.studentID,
    comment: req.body.comment,
  })
    .then(() => {
      console.log('comment data successfully saved in database');
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('error saving comment data in database', err);
      res.sendStatus(500);
    });
});

/**
 * Get request handler that finds all students in database
 * where classID matches query from client and sends back to client
 * @oaram {string} '/students' - endpoint for get request
 * @param {function} - express callback function
 */

app.get('/students', (req, res) => {
  db.models.Students.findAll({
    where: {
      classID: req.query.classID,
    },
  })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log('error querying database for students', err);
      res.sendStatus(500);
    });
});


/**
 * Get request handler that finds all classes in database
 * for a spefici teacher and sends back to client
 * @oaram {string} 'teachers' - endpoint for get request
 * @param {function} - express callback function
 */

app.get('/classes', (req, res) => {
  db.models.Classes.findAll({
    where: {
      teacherID: req.query.teacherID,
    },
  })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log('error querying database for classes', err);
      res.sendStatus(500);
    });
});


/**
 * Get request handler that finds all comments in database
 * where studentID matches query from client and sends data back to client
 * @oaram {string} '/comments' - endpoint for get request
 * @param {function} - express callback function
 */

app.get('/comments', (req, res) => {
  db.models.Comments.findAll({
    where: {
      studentID: req.query.studentID,
    },
  })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log('error querying database for comments', err);
      res.sendStatus(500);
    });
});

/**
 * Get request handler that finds teacher in database
 * where teacherID matches email of logged in user
 * @oaram {string} '/teachers' - endpoint for get request
 * @param {function} - express callback function
 */


app.get('/teachers', (req, res) => {
  db.models.Teachers.findAll({
    where: {
      email: req.query.email,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log('error getting from /teachers', err);
    });
});

/**
 * POST request handler that creates teacher in database
 * if teacher doesn't exists with name and email from google login authentication
 * @oaram {string} '/login' - endpoint for POST request
 * @param {function} - express callback function
 */

app.post('/login', (req, res) => {
  db.models.Teachers.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email,
    },
  })
    .then(() => {
      console.log('Teacher information successfully saved in the database');
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('error saving teacher info to database', err);
      res.sendStatus(500);
    });
});


/**
 * POST request handler that sends text message using Twilio API
 * using phone number and message from client request body
 * No response sent, no message data currently saved in databse
 * @oaram {string} '/texts' - endpoint for POST request
 * @param {function} - express callback function
 */

app.post('/texts', (req) => {
  client.messages.create({
    to: req.body.phone,
    from: '+15042268038',
    body: req.body.message,
  });
});

app.listen(port, () => console.log(`Our app listening on port ${port}!`));
