import angular from 'angular';
import forEach from 'lodash/forEach';

class AuthService {
  constructor($q) {
    this.currentUser = {};
    this.$q = $q;

    this.loadAuthInstance().then(() => {
      this.authInstance.isSignedIn.listen(this.onAuthChange.bind(this));
    });

    this.signInListeners = {};
  }

  // Returns promise that checks that gapi exists.
  loadApi() {
    if (!this.loadAuthPromise) {
      const deferred = this.$q.defer();
      if (window.gapi) {
        gapi.load('auth2', () => { deferred.resolve(); });
      } else {
        deferred.reject('GapiNotLoaded');
      }
      this.loadAuthPromise = deferred.promise;
    }
    return this.loadAuthPromise;
  }

  loadAuthInstance() {
    if (!this.authInstancePromise) {
      this.authInstancePromise = this.loadApi().then(() => gapi.auth2.init({
        client_id: '728044119950-mpcea0183l7c87lflutdide1vfdmvjrb.apps.googleusercontent.com',
      }).then((authInstance) => {
        this.authInstance = authInstance;
        return authInstance;
      }));
    }
    return this.authInstancePromise;
  }

  loadUser(googleUser) {
    this.user = googleUser.getBasicProfile();
    this.userId = googleUser.getAuthResponse().id_token;
    this.onAuthChange(true, true);
  }

  checkSignedIn() {
    return this.loadAuthInstance().then(() => this.authInstance.isSignedIn.get());
  }

  getCurrentUserId() {
    return this.checkSignedIn().then(isSignedIn => (isSignedIn ? this.userId : -1));
  }

  getUserInfo() {
    return this.user;
  }

  renderSignInButton(buttonId) {
    if (!window.gapi) {
      return;
    }
    gapi.signin2.render(buttonId, {
      onSuccess: this.loadUser.bind(this),
    });
  }

  signOut() {
    return gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        this.user = undefined;
        this.userId = undefined;
      });
  }

  addOnSignIn(key, func) {
    this.signInListeners[key] = func;
  }

  removeOnSignIn(key) {
    delete this.signInListeners[key];
  }

  onAuthChange(isSignIn, fromLoadUser) {
    if (isSignIn && !fromLoadUser) {
      this.loadUser(this.authInstance.currentUser.get());
    }

    forEach(this.signInListeners, (listener) => {
      listener(isSignIn);
    });
  }
}

AuthService.$inject = ['$q'];

angular.module('debugapp')
  .service('AuthService', AuthService);
