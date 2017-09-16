import angular from 'angular';

class AuthService {
  constructor($q) {
    this.currentUser = {};
    this.$q = $q;

    this.authPromise = this.loadApi().then(() => gapi.auth2.init({
      client_id: '728044119950-mpcea0183l7c87lflutdide1vfdmvjrb.apps.googleusercontent.com',
    })
      .then((authInstance) => {
        this.authInstance = authInstance;
        return authInstance;
      }));
  }

  loadApi() {
    const deferred = this.$q.defer();
    if (window.gapi) {
      gapi.load('auth2', () => { deferred.resolve(); });
    } else {
      deferred.reject('GapiNotLoaded');
    }
    return deferred.promise;
  }

  loadUser(googleUser) {
    this.user = googleUser.getBasicProfile();
    this.userId = googleUser.getAuthResponse().id_token;
    return this.user;
  }

  checkSignedIn() {
    return this.authPromise.then(() => this.authInstance.isSignedIn.get());
  }

  getCurrentUserId() {
    return this.checkSignedIn().then(isSignedIn => (isSignedIn ? this.userId : -1));
  }

  signOut() {
    return gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        this.user = undefined;
        this.userId = undefined;
      });
  }
}

AuthService.$inject = ['$q'];

angular.module('debugapp')
  .service('AuthService', AuthService);
