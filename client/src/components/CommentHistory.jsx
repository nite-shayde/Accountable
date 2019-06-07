import React from 'react';
import axios from 'axios';
import { text } from 'body-parser';

class CommentHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      textHistory: [],
    };
    this.getComments = this.getComments.bind(this);
    this.getTextHistory = this.getTextHistory.bind(this);
  }

  componentDidMount() {
    this.getComments()
      .then((data) => {
        // console.log(data);
        this.setState({
          comments: data.data,
        });
      });
    this.getTextHistory()
      .then((data) => {
        this.setState({
          textHistory: data.data,
        });
      });
  }

  getComments() {
    const { student } = this.props;
    return axios.get('/comments', {
      params: {
        studentID: student.id,
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getTextHistory() {
    return axios.get('/sms', text)
      .then((results) => {
        console.log(results);
      });
  }

  render() {
    return (
            <div>
                <h3>Comment History for {this.props.student.name}</h3>
                <table>
                    <tr>
                        <th>Date</th>
                        <th>Text</th>
                    </tr>
                    {this.state.comments.map(comment => {
                      return (
                            <tr>
                                <td>{comment.createdAt}</td>
                                {/* <td>{moment.format(comment.createdAt)}</td> */}
                                {}
                                <td>{comment.comment}</td>
                            </tr>
                      );
                    })}
                </table>
            </div>
    );
  }
}



export default CommentHistory;