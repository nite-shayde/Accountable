import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
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
    const body = { message: massTextMessage, numbers: Object.values(studentNumbers) };
    axios.post('/texts', body);
  }

  changeMassTextMessage(e) {
    this.setState({ massTextMessage: e.target.value });
  }


  toggleMassTextModal() {
    this.setState({ showMassTextModal: !this.state.showMassTextModal });
  }

  toggleNumber(e) {
    let { name, value } = e.target;
    const { studentNumbers } = this.state;
    console.log(e.target.value);
    // this.state.studentNumbers[name] = value;
    if (studentNumbers[name]) value = null;
    this.setState({ studentNumbers: { ...studentNumbers, [name]: value } });
  }

  render() {
    const { logout } = this.props;
    const {
      currentTeacherName, renderInput, currentTeacherId, currentTeacherClasses,
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
        <Modal
          show={this.state.showMassTextModal}
          onHide={this.toggleMassTextModal}
          dialogClassName="modal-90w"
        >
          <ModalHeader>
            <ModalTitle id="title" />
            {/* <Button className="btn btn-sm btn-dark" onClick={this.showHistory} id="history">View Comment History</Button>

            <Button className="btn btn-sm btn-dark" onClick={this.newComment} id="newComment">Leave a Comment</Button> */}
            MASS TEXT
          </ModalHeader>
          <ModalBody>
            <form action="/texts" method="post" onSubmit={this.sendMassText}>
              { this.state.allClasses.map(clss => (
                <div>
                  CLASS
                  { clss.map(student => (
                    <div>
                      <input type="checkbox" name={student.id} value={student.phone} onClick={this.toggleNumber} />
                      {student.name}
                    </div>
                  )) }
                </div>
              )) }
              <textarea name="text-message" onChange={this.changeMassTextMessage} />
              <input type="submit" value="Submit" />
            </form>
          </ModalBody>
          <ModalFooter>
            {/* <Button onClick={this.handleHide} className="btn btn-sm btn-dark">Close</Button> */}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default TeacherHome;
