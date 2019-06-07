import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import axios from 'axios';

const moment = require('moment');


class CommentModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      history: true,
      newComment: false,
      commentText: '',
      comments: [],
      textMessageText: '',
    };
    this.handleShow = () => {
      this.setState({ show: true });
    };
    this.handleHide = () => {
      this.setState({ show: false });
    };

    this.showHistory = this.showHistory.bind(this);
    this.newComment = this.newComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.changeComment = this.changeComment.bind(this);
    this.changeText = this.changeText.bind(this);
    this.sendText = this.sendText.bind(this);
  }

  componentDidMount() {
    this.getComments()
      .then((data) => {
        this.setState({
          comments: data.data,
        });
      });
  }

  getComments() {
    const { currentStudent } = this.props;
    return axios.get('/comments', {
      params: {
        studentID: currentStudent.id,
      },
    });
  }

  sendText() {
    const { textMessageText } = this.state;
    const { currentStudent, teacherName } = this.props;
    // make post request to server
    let body = `From: ${teacherName}\nTo: ${currentStudent.parentName}\n\nMsg: ${textMessageText}`;
    body += '\n\n*Note: if responding, please indicate who your message is to.';

    let phone = currentStudent.phone.replace(/-/g, '');
    phone = `+1${phone}`;

    axios.post('/texts', {
      phone,
      message: body,
    });

    this.setState({
      textMessageText: '',
    });
  }

  changeText(e) {
    this.setState({
      textMessageText: e.target.value,
    });
  }

  changeComment(e) {
    this.setState({
      commentText: e.target.value,
    });
  }

  submitComment() {
    const { commentText } = this.state;
    const { currentStudent } = this.props;
    axios.post('/comments', {
      studentID: currentStudent.id,
      comment: commentText,
    })
      .then(() => {
        this.getComments()
          .then((data) => {
            this.setState({
              comments: data.data,
            });
          });
      });

    this.setState({
      commentText: '',
    });
  }

  newComment() {
    this.setState({
      newComment: true,
      history: false,
    });
  }

  showHistory() {
    this.setState({
      newComment: false,
      history: true,
    });
  }


  render() {
    const { history, comments, newComment } = this.state;
    const { currentStudent } = this.props;
    let whichRendered;
    if (history) {
      whichRendered = (
        <div>
          <h3>
            Comment History for
            {currentStudent.name}
          </h3>
          <table className="comentTable">
            <thead>
              <tr>
                <td className="tableHead tableRows">Comment</td>
                <td className="tableHead tableRows">Date</td>
              </tr>
            </thead>
            {comments.map(comment => (
              <tbody>
                <tr>
                  <td className="tableRows">{comment.comment}</td>
                  <td className="tableRows">{moment().format('ddd, MMM, Do')}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      );
    } else if (newComment) {
      const { name } = this.props;
      const { commentText, textMessageText } = this.state;
      whichRendered = (
        <div>
          <h5>
          Add Comment for
            {name}
          </h5>
          <div>
            <input value={commentText} onChange={this.changeComment} />
            <button type="submit" onClick={this.submitComment}>Submit Comment</button>
          </div>
          <div>
            <input value={textMessageText} onChange={this.changeText} />
            <button type="submit" onClick={this.sendText}>Send Text</button>
          </div>
        </div>
      );
    }
    const { show } = this.state;
    const { name } = this.props;
    return (
      <>
        <Button variant="dark" onClick={this.handleShow} className="btn btn-sm">
          {name}
        </Button>
        <Modal
          show={show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
        >
          <ModalHeader>
            <ModalTitle id="title" />
            <Button className="btn btn-sm btn-dark" onClick={this.showHistory} id="history">View Comment History</Button>

            <Button className="btn btn-sm btn-dark" onClick={this.newComment} id="newComment">Leave a Comment</Button>
          </ModalHeader>
          <ModalBody>
            {whichRendered}
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.handleHide} className="btn btn-sm btn-dark">Close</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default CommentModal;
