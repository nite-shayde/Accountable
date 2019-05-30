require('dotenv').config();

const { MASTER_USERNAME,
        DB_NAME,
        DB_PASSWORD,
        DB_PORT,
        DB_URI
    } = process.env;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DB_NAME, MASTER_USERNAME, DB_PASSWORD, {
    host: DB_URI,
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to database successful');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const Teachers = sequelize.define('teacher', {
    // name 
    // classes 
    // school 
    name: {
        type: Sequelize.STRING,
    },
    classes: {
        type: Sequelize.JSON,
    },
    school: {
        type: Sequelize.STRING,
    },
});

const Classes = sequelize.define('class', {
    // name, students 
    name: {
        type: Sequelize.STRING,
    },
    students: {
        type: Sequelize.JSON,
    },
    teacherID: {
        type: Sequelize.INTEGER,
        references: { model: 'teachers', key: 'id' }
    },
});

const Students = sequelize.define('student', {
    //name, parentname, phone, email comments
    name: {
        type: Sequelize.STRING,
    },
    parentName: {
        type: Sequelize.STRING,
    },
    phone: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    comments: {
        type: Sequelize.JSON,
    },
    classID: {
        type: Sequelize.INTEGER,
        references: {model: 'classes', key: 'id'}
    },
});

// one student has many comments

const Comments = sequelize.define('comment', {
    studentID: {
        type: Sequelize.INTEGER,
        references: {model: 'students', key: 'id'}
    },
    comment: {
        type: Sequelize.TEXT,
    },
    date: {
        type: Sequelize.DATE,
    },
});


Teachers.sync();
Classes.sync();
Students.sync();
Comments.sync();


module.exports.models = {
    Teachers,
    Classes,
    Students,
    Comments
}