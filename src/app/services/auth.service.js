import angular from 'angular';
import forEach from 'lodash/forEach';

class AuthService {
  constructor($q) {
    this.currentUser = {};
    this.$q = $q;

    this.checkSignedIn().then((isSignedIn) => {
      this._onAuthChange(isSignedIn);
      this.authInstance.isSignedIn.listen(this._onAuthChange.bind(this));
    });

    this.signInListeners = {};
  }

  // Returns promise that checks that gapi exists.
  loadApi() {
    if (!this._loadAuthPromise) {
      const deferred = this.$q.defer();
      if (window.gapi) {
        gapi.load('auth2', () => { deferred.resolve(); });
      } else {
        deferred.reject('GapiNotLoaded');
      }
      this._loadAuthPromise = deferred.promise;
    }
    return this._loadAuthPromise;
  }

  _loadAuthInstance() {
    if (!this._authInstancePromise) {
      this._authInstancePromise = this.loadApi().then(() => {
        const deferred = this.$q.defer();
        // auth2.init() returns a GoogleAuth instance. gapi.auth2 is also a GoogleAuth instance
        // GoogleAuth.then() is a custom defined function. Takes onInit() and onError() as args.
        // Do not chain this .then() It is not a normal .then() Will result in an infinte loop
        gapi.auth2.init({
          client_id: '728044119950-mpcea0183l7c87lflutdide1vfdmvjrb.apps.googleusercontent.com',
        }).then((authInstance) => {
          // authInstance is a GoogleAuth instance
          // NEVER RESOLVE A PROMISE WITH authInstance. EVERYTHING WILL BREAK.
          this.authInstance = authInstance;
          deferred.resolve(true);
        }, () => deferred.reject('Auth2 initialisation error'));
        return deferred.promise;
      });
    }
    return this._authInstancePromise;
  }

  checkSignedIn() {
    return this._loadAuthInstance().then(() => this.authInstance.isSignedIn.get());
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
    gapi.signin2.render(buttonId);
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

  _onAuthChange(isSignIn) {
    if (isSignIn) {
      const googleUser = this.authInstance.currentUser.get();
      this.user = googleUser.getBasicProfile();
      this.userId = googleUser.getAuthResponse().id_token;
    }

    forEach(this.signInListeners, (listener) => {
      listener(isSignIn);
    });
  }
}

AuthService.$inject = ['$q'];

angular.module('debugapp')
  .service('AuthService', AuthService);
