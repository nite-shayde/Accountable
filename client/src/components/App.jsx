import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'firebase/auth';
import axios from 'axios';
import { auth, provider } from '../firebaseConfig.js';
import TeacherHome from './TeacherHome.jsx';
import '../../styles/styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
  * component did mount changes state of user form null to user from firebase login
  */

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  /**
   * logout changes state of user back to null
   */

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null,
        });
      });
  }

  /**
   * login function makes a post request to '/login', sending email and name on request body
   * updates the state of user to the user who has logged in
   */

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        axios.post('/login', {
          name: result.additionalUserInfo.profile.name,
          email: result.additionalUserInfo.profile.email,
        });
        this.setState({
          user: result.user,
        });
      });
  }

  /**
   * render function conditionally renders different html based on state of user
   * if user is not null, TeacherHome component is rendered
   * else, login page is rendered
   */

  render() {
    const { user } = this.state;
    const authButton = user
      ? <TeacherHome user={user} logout={this.logout} />
      : (
        <div className="logincontainer">
          <h3 className="introtitle">Accountable</h3>
          <p>The app that lets teachers do more</p>
          <input onClick={this.login} alt="" className="loginButton" type="image" src="https://www.c-learning.net/storage/app/media/img/buttons/google-login-button.png" />
        </div>
      );
    return (
      <div className="container">
        <div>
          { authButton }
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
