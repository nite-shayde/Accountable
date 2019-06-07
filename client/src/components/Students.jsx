import React from 'react';
import axios from 'axios';
import Modal from './Modal.jsx';
import StudentModal from './newStudentModal.jsx';

class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      name: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
    };
    this.addStudents = this.addStudents.bind(this);
    this.changeStudentData = this.changeStudentData.bind(this);
    this.getStudents = this.getStudents.bind(this);
    this.addComment = this.addComment.bind(this);
    this.showCommentHistory = this.showCommentHistory.bind(this);
    this.toggleStudents = this.toggleStudents.bind(this);
    this.changeStudentState = this.changeStudentState.bind(this);
  }

  // get student data based on class ID, load it into students array on comp mount

  componentDidMount() {
    this.getStudents()
      .then((data) => {
        this.setState({
          students: data.data,
        });
      });
  }

  getStudents() {
    const { classID } = this.props;

    return axios.get('/students', {
      params: {
        classID,
      },
    });
  }


  changeStudentState(data) {
    this.setState({
      students: data,
    });
  }

  // add students to database
  addStudents() {
    const { classID } = this.props;
    const {
      name, parentName, parentEmail, parentPhone,
    } = this.state;
    axios.post('/students', {
      name,
      parentName,
      email: parentEmail,
      phone: parentPhone,
      classID,
    });
  }


  // capture student data
  changeStudentData(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  addComment(e) {
    const { students, renderCommentForm } = this.state;
    // when button is clicked,
    // get student in that row and set state of current student to that student
    const studentID = parseInt(e.target.name, 10);

    students.map(function commentFunc(student) {
      if (student.id === studentID) {
        this.setState({
          currentStudent: student,
        }, function commentStateFunc() {
          this.setState({
            renderCommentForm: !renderCommentForm,
          });
        });
      }
    });
  }

  showCommentHistory(e) {
    const studentID = parseInt(e.target.name, 10);
    const { students, renderCommentHistory } = this.state;
    // set the state of currentStudent
    // pass down to commenthistory
    // render comment history
    students.map(function studentSet(student) {
      if (student.id === studentID) {
        this.setState({
          currentStudent: student,
        }, function states() {
          this.setState({
            renderCommentHistory: !renderCommentHistory,
          });
        });
      }
    });
  }

  toggleStudents() {
    const { studentView } = this.state;
    this.setState({
      studentView: !studentView,
    });
  }


  render() {
    const {
      className, classID, changeState, showList, teacherName,
    } = this.props;

    const { students } = this.state;
    return (
      <div>
        <button type="submit" onClick={() => { changeState(); showList(); }} className="btn btn-sm">Back</button>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <h3>{className}</h3>
          <StudentModal studentChange={this.changeStudentState} classID={classID} />
        </div>
        <div className="studentListDiv">
          <table className="table table-hover table-sm table-condensed">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="tableName">Name</th>
                <th className="tableGuardian">Guardian</th>
                <th className="tablePhone">Phone</th>
                <th className="tableEmail">Email</th>
                {/* <th className="tableComments">Comments</th> */}
              </tr>
            </thead>
            <tbody>
              {
                students.map(student => (
                  <tr key={student.id} className="student-row">
                    <td><Modal currentStudent={student} name={student.name} teacherName={teacherName} /></td>
                    <td>{student.parentName || 'no parent name'}</td>
                    <td>{student.phone || 'no phone number'}</td>
                    <td>{student.email || 'no email'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}


export default Students;
