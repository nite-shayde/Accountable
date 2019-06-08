require('dotenv').config();

/**
 * Database env variables
 */

const {
  MASTER_USERNAME,
  DB_NAME,
  DB_PASSWORD,
  DB_URI,
} = process.env;


/**
 * Using sequelize to connect to mysql database
 */

const Sequelize = require('sequelize');

const sequelize = new Sequelize(DB_NAME, MASTER_USERNAME, DB_PASSWORD, {
  host: DB_URI,
  dialect: 'mysql',
});


/**
 * Function call that connects to database
 * If databse connection is successful, success message logged to console
 */

sequelize.authenticate()
.then(() => {
  console.log('Connection to database successful');
})
.catch((err) => {
  console.error('Unable to connect to the database:', err);
});

/**
 * Stuents is sequelize model that links to Stuents table in our database
 * Stuents model has name (string), parnetName (string)
 * phone (string), email (string), and classID (foreign key pointing to Classes table ID)
 */

const Students = sequelize.define('students', {
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
  classID: {
    type: Sequelize.INTEGER,
    references: { model: 'classes', key: 'id' },
  },
});

/**
 * Teachers is sequelize model that links to Teachers table in our database
 * Teachers model has name (string), and email (string)
 */

const Teachers = sequelize.define('teachers', {
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  number: {
    type: Sequelize.STRING,
    defaultValue: '+15042268038',
  },
});

/**
 * Classes is sequelize model that links to Classes table in our database
 * Classes model has name (string), and teacherID (foreign key pointing to Teachers table ID)
 */

const Classes = sequelize.define('class', {
  name: {
    type: Sequelize.STRING,
  },
  teacherID: {
    type: Sequelize.INTEGER,
    references: { model: 'teachers', key: 'id' },
  },
});

/**
 * Convos is sequelize model that connects the students, teachers, and messages
 */

const Convos = sequelize.define('convos', {
  teacherNumber: {
    type: Sequelize.STRING,
    // references: { model: 'teachers', key: 'number' },
  },
  parentNumber: {
    type: Sequelize.STRING,
    // references: { model: 'students', key: 'phone' },
  },
  // Teachers.belongsTo
});


/**
 * Classes is sequelize model that links to Classes table in our database
 * Classes model has studentID (foreign key pointing to Student table id) and comment (text)
 */

const Comments = sequelize.define('comment', {
  studentID: {
    type: Sequelize.INTEGER,
    references: { model: 'students', key: 'id' },
  },
  comment: {
    type: Sequelize.TEXT,
  },
});

const Messages = sequelize.define('messages', {
  convoID: {
    type: Sequelize.INTEGER,
    references: { model: 'convos', key: 'id' },
  },
  incoming: {
    type: Sequelize.BOOLEAN,
  },
  body: {
    type: Sequelize.STRING,
  },
  phoneNumber: {
    type: Sequelize.STRING,
  },
});

sequelize.sync({ force: false }).then(() => {
// Teachers.create({ name: 'jesse', email: 'jesse@jesse.com' });
});

function saveMessage(message) {
  const { teacherNumber, parentNumber } = message;
  return Convos.findOrCreate({
    where: {
      teacherNumber,
      parentNumber,
    },
    defaults: {
      teacherNumber,
      parentNumber,
    },
  }).then((convo) => {
    // eslint-disable-next-line no-param-reassign
    message.convoID = convo[0].id;
    return Messages.create(message);
  });
}

function getConvo(numbers) {
  const { parentNumber, teacherNumber } = numbers;
  return Convos.findOne({
    where: {
      parentNumber,
      teacherNumber,
    },
  }).then((convo) => {
    return Messages.findAll({
      where: {
        convoID: convo.id,
      },
    });
  });
}
getConvo({ parentNumber: '+16172839108', teacherNumber: '+15042268038' });
// saveMessge({ teacherNumber: '123458901', parentNumber: '00000', incoming: true, body: 'what u did wit mah kid?' })

// Convos.create({
//   teacherNumber: '12345678901', parentNumber: '5',
// }).then((convo) => { 

// }).catch(err => { 
//   console.log(err);
// });
/**
 * Export models to use on server index.js to add / remove / update data in database
 */

module.exports.models = {
  Teachers,
  Classes,
  Students,
  Comments,
  Convos,
  Messages,
  saveMessage,
  getConvo,
};


// TEST
