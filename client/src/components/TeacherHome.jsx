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
      currentTeacherNumber: '',
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
        const { name, id, number } = data.data[0];
        this.setState({
          currentTeacherId: id,
          currentTeacherName: name,
          currentTeacherNumber: number,
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
    const {
      massTextMessage, showMassTextModal, confirmMessage, formDisabled, currentTeacherNumber,
    } = this.state;

    const {
      currentTeacherName, renderInput, currentTeacherId, currentTeacherClasses, students, allClasses,
    } = this.state;

    return (
      <div className="">
        <div className="sidebar d-flex flex-column p-3 flex-grow-0">

          <div className="">
            <h5 className="text-info">{`${currentTeacherName}`}</h5>
          </div>
          <div>
            <img className="img-fluid" src="http://icons.iconarchive.com/icons/goodstuff-no-nonsense/free-space/1024/earth-icon.png" alt="space and beyond" />
          </div>
          <div className="card">
            <div className="card-header card-header-tabs card-header-primary">
              Students
            </div>
            <div className="card-body">
              <div className="vertical-scroll d-flex flex-column p-2 bg-light border">
                { students.map(student => (
                  <StudentModal
                    currentStudent={student}
                    name={student.name}
                    teacherName={currentTeacherName}
                    teacherNumber={currentTeacherNumber}
                    key={student.id}
                  />
                )) }
              </div>
            </div>

            <div className="card-footer">
              <button type="submit" className="btn btn-success" onClick={this.toggleMassTextModal}>mass text</button>
            </div>

          </div>

        </div>

        <div className="main-panel">
          <div className="shadow rounded mt-3 bg-light py-3 px-5 mb-3">
            <div className="header d-flex flex-column">
              <div className="d-flex flex-row justify-content-between">
                <h1 className="text-primary">Accountable</h1>
                <div><button type="submit" className="btn btn-sm btn-dark" id="" onClick={logout}>Log Out</button></div>
              </div>
              <div id="quote" className="font-italic d-flex justify-content-center">If you want to make an apple pie from scratch, you must first create the universe.</div>
              <h6 className="d-flex justify-content-center">- Carl Sagan</h6>
            </div>
          </div>

          <div>
            <div className="d-flex flex-row mb-4">
              <input placeholder="new class name" onChange={this.changeInputState} />
              <button type="submit" className="btn btn-success btn-sm" onClick={this.submitClassHandler}>add class</button>
            </div>
          </div>

          <div className="classes">
            <Classes
              teacherID={currentTeacherId}
              teacherName={currentTeacherName}
              classList={currentTeacherClasses}
            />
          </div>

          {/** MASS TEXT MODAL */}
          <Modal
            show={showMassTextModal}
            onHide={this.toggleMassTextModal}
            dialogClassName="modal-90w"
          >
            <ModalHeader>
              <ModalTitle id="title" />
              <h3>Mass Text</h3>
            </ModalHeader>
            <ModalBody>
              <form action="/texts" method="post" onSubmit={this.sendMassText}>
                {/* <button type="button" value="false" className="btn btn-info btn-sm" onClick={this.selectAll}>select all</button> */}
                <input type="checkbox" onClick={this.selectAll} />
                <h5 className="d-inline text-secondary ml-1">select/deselect all</h5>
                <fieldset disabled={formDisabled} className="mt-2">
                  { allClasses.map(clss => (
                    <div key={clss.name}>
                      <fieldset>
                        <input type="checkbox" onClick={this.selectAll} />
                        <h4 className="d-inline ml-1">
                          { clss.name }
                        </h4>
                        { clss.students.map(student => (
                          <div className="ml-3" key={student.name}>
                            <input type="checkbox" name={student.id} value={student.phone} onClick={this.toggleNumber} />
                            <span className="ml-1">{student.name}</span>
                          </div>
                        )) }
                      </fieldset>
                    </div>
                  )) }
                  <textarea className="mt-2" name="text-message" value={massTextMessage} onChange={this.changeMassTextMessage} />
                  <div><input type="submit" value="Submit" className="btn btn-primary" /></div>
                </fieldset>
              </form>
              <div className="text-success">
                <h5>{confirmMessage}</h5>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => this.setState({ showMassTextModal: false })} className="btn btn-sm btn-dark">Close</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}


export default TeacherHome;
