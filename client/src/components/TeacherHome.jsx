/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import StudentModal from './Modal.jsx';
import Classes from './Classes.jsx';


class TeacherHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTeacherId: 0,
      currentTeacherName: '',
      currentTeacherClasses: [],
      inputState: '',
      renderInput: false,
      showMassTextModal: false,
      allClasses: [],
      studentNumbers: {},
      massTextMessage: '',
      students: [],
      confirmMessage: '',
      formDisabled: false,
    };
    this.getTeacherData = this.getTeacherData.bind(this);
    this.submitClass = this.submitClass.bind(this);
    this.changeInputState = this.changeInputState.bind(this);
    this.submitClassHandler = this.submitClassHandler.bind(this);
    this.getClassData = this.getClassData.bind(this);
    this.renderClassInput = this.renderClassInput.bind(this);
    this.toggleMassTextModal = this.toggleMassTextModal.bind(this);
    this.sendMassText = this.sendMassText.bind(this);
    this.toggleNumber = this.toggleNumber.bind(this);
    this.changeMassTextMessage = this.changeMassTextMessage.bind(this);
    this.studentInfo = this.studentInfo.bind(this);
    this.selectAll = this.selectAll.bind(this);
  }


  componentDidMount() {
    this.getTeacherData()
      .then((data) => {
        const { name, id } = data.data[0];

        this.setState({
          currentTeacherId: id,
          currentTeacherName: name,
        });
      })
      .then(() => {
        this.getClassData()
          .then((data) => {
            this.setState({
              currentTeacherClasses: data.data,
            });
          });
      });
    // get all classes
    axios.get('/classes', { params: { withStudents: true } }).then((response) => {
      const classes = response.data;
      this.setState({ allClasses: classes });
    }).catch((err) => { console.log(err); });

    // get all students
    axios.get('/students')
      .then((response) => {
        const students = response.data;
        this.setState({ students });
        console.log(this.state.students);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTeacherData() {
    const { user } = this.props;
    return axios.get('/teachers', {
      params: {
        email: user.email,
      },
    });
  }

  getClassData() {
    const { currentTeacherId } = this.state;
    return axios.get('/classes', {
      params: {
        teacherID: currentTeacherId,
      },
    });
  }

  submitClass(className) {
    const { currentTeacherId } = this.state;
    axios.post('/classes', {
      className,
      id: currentTeacherId,
    })
      .then(() => {
        this.getClassData()
          .then((data) => {
            this.setState({
              currentTeacherClasses: data.data,
            });
          });
      });
  }

  submitClassHandler() {
    const { inputState } = this.state;
    this.submitClass(inputState);
    this.renderClassInput();
  }


  changeInputState(e) {
    this.setState({
      inputState: e.target.value,
    });
  }

  renderClassInput() {
    const { renderInput } = this.state;
    this.setState({
      renderInput: !renderInput,
    });
  }

  // Accountable 2.0
  sendMassText(e) {
    e.preventDefault();
    const { massTextMessage, studentNumbers } = this.state;
    this.setState({ formDisabled: true });
    const body = { message: massTextMessage, numbers: Object.values(studentNumbers) };
    axios.post('/texts', body).then(() => {
      this.setState({ confirmMessage: 'message sent!', formDisabled: false });
    });
    this.setState({ massTextMessage: '' });
  }


  changeMassTextMessage(e) {
    this.setState({ massTextMessage: e.target.value });
  }


  toggleMassTextModal() {
    this.setState({ showMassTextModal: !this.state.showMassTextModal });
  }

  toggleNumber(e) {
    let { name, value } = e.target;
    console.log(name);
    this.setState((prevState) => {
      const { studentNumbers } = prevState;
      if (studentNumbers[name]) value = null;
      return { studentNumbers: { ...studentNumbers, [name]: value } };
    });
  }

  studentInfo() {
    console.log('student is clicked');
  }

  selectAll(e) {
    // const button = e.target;
    // let select = true;
    // // if (button.innerText === 'SELECT ALL') {
    // if (!button.checked) {
    //   // button.innerText = 'DESELECT ALL';
    //   select = false;
    // }
    // else {
    //   button.innerText = 'SELECT ALL';
    //   select = false;
    // }
    const button = e.target;
    const { checked } = button;
    [...button.parentElement.elements].forEach((elem) => {
      const click = (!elem.checked && button.checked) || (elem.checked && !button.checked);
      if (elem.type === 'checkbox' && click && elem !== button) {
        elem.click();
      }
    });
  }


  render() {
    const { logout } = this.props;
    // console.log(this.state.students);
    const {
      massTextMessage, showMassTextModal, confirmMessage, formDisabled,
    } = this.state;

    const {
      currentTeacherName, renderInput, currentTeacherId, currentTeacherClasses, students, allClasses,
    } = this.state;
    return (
      <div>
        <div className="jumbotron jumbotron-fluid">
          <div className="header">
            <h1 className="title">Accountable</h1>
            <p id="quote">Experience teaches only the teachable.</p>
            <p id="quoteauthor">-Aldous Huxley</p>
            <button type="submit" text-align="right" className="btn btn-sm" id="logoutButt" onClick={logout}>Log Out</button>
          </div>
        </div>
        <div className="greeting">
          <h4>
            Welcome Back,
            {currentTeacherName}
          </h4>
        </div>
        <br />
        <div className="classes">
          <button type="submit" className="btn btn-dark btn-sm" onClick={this.renderClassInput}>Add Class</button>
          <button type="submit" className="btn btn-dark btn-sm" onClick={this.toggleMassTextModal}>mass text</button>
          {renderInput
            ? (
              <div>
                <input placeholder="new class name" onChange={this.changeInputState} />
                <button type="submit" className="btn btn-dark btn-sm" onClick={this.submitClassHandler}>Submit</button>
              </div>
            )
            : null }
          <Classes
            teacherID={currentTeacherId}
            teacherName={currentTeacherName}
            classList={currentTeacherClasses}
          />
        </div>
        <div className="select box">
          {/* <select onChange={this.studentInfo}> */}
          {/* <option value="title">Select Student</option> */}
          { students.map(student => (
            <StudentModal currentStudent={student} name={student.name} teacherName={currentTeacherName} />
            // <option value="student">{student.name}</option>
          )) }
          {/* </select> */}
        </div>
        {/** MASS TEXT MODAL */}
        <Modal
          show={showMassTextModal}
          onHide={this.toggleMassTextModal}
          dialogClassName="modal-90w"
        >
          <ModalHeader>
            <ModalTitle id="title" />
            {/* <Button className="btn btn-sm btn-dark" onClick={this.showHistory} id="history">View Comment History</Button>

            <Button className="btn btn-sm btn-dark" onClick={this.newComment} id="newComment">Leave a Comment</Button> */}
            <h3>Mass Text</h3>
          </ModalHeader>
          <ModalBody>
            <form action="/texts" method="post" onSubmit={this.sendMassText}>
              {/* <button type="button" value="false" className="btn btn-info btn-sm" onClick={this.selectAll}>select all</button> */}
              <input type="checkbox" onClick={this.selectAll} />
              <h5 className="d-inline text-secondary ml-1">select/deselect all</h5>
              <fieldset disabled={formDisabled} className="mt-2">
                { allClasses.map(clss => (
                  <div>
                    <fieldset>
                      <input type="checkbox" onClick={this.selectAll} />
                      <h4 className="d-inline ml-1">
                        { clss.name }
                      </h4>
                      { clss.students.map(student => (
                        <div className="ml-3">
                          <input type="checkbox" name={student.id} value={student.phone} onClick={this.toggleNumber} />
                          <span className="ml-1">{student.name}</span>
                        </div>
                      )) }
                    </fieldset>
                  </div>
                )) }
                <textarea className="mt-2" name="text-message" value={massTextMessage} onChange={this.changeMassTextMessage} />
                <div><input type="submit" value="Submit" /></div>
              </fieldset>
            </form>
            <div className="text-success">
              <h5>{confirmMessage}</h5>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.handleHide} className="btn btn-sm btn-dark">Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default TeacherHome;
