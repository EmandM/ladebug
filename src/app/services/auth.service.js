import angular from 'angular';
import forEach from 'lodash/forEach';
import constant from 'lodash/constant';

class AuthService {
  constructor(restangular, $q) {
    this.currentUser = {};
    this.restangular = restangular;
    this.$q = $q;

    this.checkSignedIn().then((isSignedIn) => {
      this._onAuthChange(isSignedIn);
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

  // private method
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
          authInstance.isSignedIn.listen(this._onAuthChange.bind(this));
          deferred.resolve(true);
        }, () => deferred.reject('Auth2 initialisation error'));
        return deferred.promise;
      });
    }
    return this._authInstancePromise;
  }

  checkSignedIn() {
    return this._loadAuthInstance().then(() => this.authInstance.isSignedIn.get())
      .catch(constant(false));
  }

  getCurrentUserId() {
    return this.checkSignedIn().then(isSignedIn => (isSignedIn ? this.userId : -1));
  }

  getUserInfo() {
    return this.user;
  }

  getUserEmail() {
    return this.user ? this.user.getEmail() : '';
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

  checkIsAdmin() {
    console.log("checking for admin")
    return this.restangular.one('admin')
      .customGET('', { userId: this.userId })
      .then((response) => {
        console.log(response);
        return true;
      });
  }

  // private method
  _onAuthChange(isSignIn) {
    this.isSignedIn = isSignIn;
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

AuthService.$inject = ['Restangular', '$q'];

angular.module('debugapp')
  .service('AuthService', AuthService);
