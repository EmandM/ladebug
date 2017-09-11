import angular from 'angular';
import GoogleSignIn from 'google-sign-in';

class AuthService {
  constructor() {
    this.project = new GoogleSignIn.Project('728044119950-mpcea0183l7c87lflutdide1vfdmvjrb.apps.googleusercontent.com');
    this.currentUser = {};
  }

  loadUser(googleUser) {
    this.user = googleUser.getBasicProfile();
    this.userId = googleUser.getAuthResponse().id_token;
    this.loggedIn = true;
    return this.user;
  }

  getCurrentUserId() {
    return (this.loggedIn) ? this.userId : -1;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  signOut() {
    return gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        this.user = undefined;
        this.loggedIn = false;
      });
  }
}

AuthService.$inject = [];

angular.module('debugapp')
  .service('AuthService', AuthService);
