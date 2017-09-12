import angular from 'angular';
import GoogleSignIn from 'google-sign-in';

class AuthService {
  constructor($q) {
    this.$q = $q;
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
    // return this.$q.when((this.loggedIn) ? this.userId : -1);
    // TODO change back to this ^ when auth is loading in time!
    return this.$q.when((this.loggedIn) ? this.userId : 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3NTQ0YWVmZDQ0ODdjNmRlODhkNjFhYmMzY2JjM2YxOGYzOTM3M2MifQ.eyJhenAiOiI3MjgwNDQxMTk5NTAtbXBjZWEwMTgzbDdjODdsZmx1dGRpZGUxdmZkbXZqcmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MjgwNDQxMTk5NTAtbXBjZWEwMTgzbDdjODdsZmx1dGRpZGUxdmZkbXZqcmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA4NjEwMDY1ODA5NzE5ODI4MjUiLCJoZCI6ImF1Y2tsYW5kdW5pLmFjLm56IiwiZW1haWwiOiJlc3RlNzc1QGF1Y2tsYW5kdW5pLmFjLm56IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJzOC1YaTU2dVhGSG1ZVkpvVnRvbmFBIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwNTEyNTc0NiwiZXhwIjoxNTA1MTI5MzQ2LCJuYW1lIjoiRWxpemFiZXRoIFN0ZXZlbnNvbiIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLUxsU05IM0VSWG9RL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FQSnlwQTNfNEtOcEEwbmFuZzVVYWQ3Z2VFNXprX19vcEEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkVsaXphYmV0aCIsImZhbWlseV9uYW1lIjoiU3RldmVuc29uIiwibG9jYWxlIjoiZW4tR0IifQ.LKtTmmYOF-scx8GD5WsFtV6KYobfc2mgHZmb2JZDP5_IpeBtmMgzibrwLu-n0fMAGxL-4k3mThm9_a9a_00fVC0IIBtdra3qKF-cc0JCrXy1HHB4FFkae540Aik7k7DUpMy5frzYoxWdJ8sl4fStfGC7qieoxpkfpgWTl0eGVO6V5v5WmjfUg3IChfyqaieNH3x8ABb2avvwjll42u1dWV1WSEjLYn7kWSD0UcCX1x1sB2FAbpwSIm4D6m64a_nm0hCEnHpBJC524vSlbKqdWZNy3pnnJBdSIk4ybB0EhDzvXcuKO48stoteyRaqfT_PIEfK3H4KmRbgXCbwypAmIA');
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

AuthService.$inject = ['$q'];

angular.module('debugapp')
  .service('AuthService', AuthService);
