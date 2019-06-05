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
    };
    this.getTeacherData = this.getTeacherData.bind(this);
    this.submitClass = this.submitClass.bind(this);
    this.changeInputState = this.changeInputState.bind(this);
    this.submitClassHandler = this.submitClassHandler.bind(this);
    this.getClassData = this.getClassData.bind(this);
    this.renderClassInput = this.renderClassInput.bind(this);
    this.toggleMassTextModal = this.toggleMassTextModal.bind(this);
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

  toggleMassTextModal() {
    this.setState({ showMassTextModal: !this.state.showMassTextModal });
  }

  renderClassInput() {
    const { renderInput } = this.state;
    this.setState({
      renderInput: !renderInput,
    });
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
            {/* {whichRendered} */}
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
