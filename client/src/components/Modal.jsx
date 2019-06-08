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
      textHistory: [],
    };
    this.handleShow = () => {
      this.setState({ show: true });
      this.getComments();
      this.getTextHistory();
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
    this.getTextHistory = this.getTextHistory.bind(this);
  }

  componentDidMount() {
    this.getComments()
      .then((response) => {
        this.setState({
          comments: response.data,
        });
      });
    this.getTextHistory()
      .then((response) => {
        this.setState({
          textHistory: response.data,
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

  getTextHistory() {
    const { teacherNumber, currentStudent } = this.props;
    const { textHistory } = this.state;
    let phone = currentStudent.phone.replace(/-/g, '');
    phone = `+1${phone}`;
    const options = { params: { teacherNumber, parentNumber: phone } };
    return axios.get('/sms', options);
  }

  sendText() {
    const { textMessageText, textHistory } = this.state;
    const { currentStudent, teacherName, teacherNumber } = this.props;
    // make post request to server

    // let body = `From: ${teacherName}\nTo: ${currentStudent.parentName}\n\nMsg: ${textMessageText}`;
    // body += '\n\n*Note: if responding, please indicate who your message is to.';

    let phone = currentStudent.phone.replace(/-/g, '');
    phone = `+1${phone}`;


    axios.post('/texts', {
      phone,
      message: textMessageText,
      teacherNumber,
    }).then((res) => {
      this.setState({ textHistory: textHistory.concat(res.data) });
      console.log(res.status);
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
    this.getComments();
  }

  showHistory() {
    this.setState({
      newComment: false,
      history: true,
    });
    this.getTextHistory();
  }


  render() {
    const {
      history, comments, newComment, textHistory, show, commentText, textMessageText,
    } = this.state;
    const { currentStudent, name, teacherName } = this.props;

    let whichRendered;
    if (history) {
      whichRendered = (
        <div>
          <h3>
            {`Comment History for ${currentStudent.name}`}
          </h3>
          <table className="comentTable">
            <thead className="bg-secondary text-white p-2">
              <tr>
                <th className="px-2">Teacher</th>
                <th className="px-2">Comment</th>
                <th className="px-2">Date</th>
              </tr>
            </thead>
            {comments.map(comment => (
              <tbody key={comment.id}>
                <tr>
                  <td className="px-2">{teacherName}</td>
                  <td className="px-2">{comment.comment}</td>
                  <td className="px-2">{moment(comment.createdAt).format('ddd, MMM, Do')}</td>
                </tr>
              </tbody>
            ))}
          </table>
          <div className="mt-3">
            <h6>{`Add Comment for ${name}`}</h6>
            <input value={commentText} onChange={this.changeComment} />
            <button type="submit" onClick={this.submitComment} className="btn btn-sm btn-success">Add Comment</button>
          </div>
        </div>
      );
    } else if (newComment) {
      whichRendered = (
        <div>
          {textHistory.map(text => <TextMessageItem text={text} teacherName={teacherName} parentName={currentStudent.parentName} key={text.id} />)}

          <div>
            <input value={textMessageText} onChange={this.changeText} />
            <button type="submit" onClick={this.sendText} className="btn btn-sm btn-success">Send Text</button>
          </div>
        </div>
      );
    }


    return (
      <>
        <Button variant="dark" onClick={this.handleShow} className="btn btn-sm btn-info">
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

            <Button className="btn btn-sm btn-dark" onClick={this.newComment} id="newComment">{`TEXT ${currentStudent.parentName}`}</Button>
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


function TextMessageItem(props) {
  const { text, teacherName, parentName } = props;
  const { incoming, body } = text;
  let senderClass = 'font-weight-bold';
  if (incoming) senderClass += ' text-info';
  return (
    <div className="d-flex flex-row">
      <div>
        <span className={senderClass}>{incoming ? parentName : teacherName }</span>
        {`: ${body}`}
      </div>
    </div>
  );
}

export default CommentModal;
