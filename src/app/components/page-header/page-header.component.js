import angular from 'angular';

import template from './page-header.template.html';
import './page-header.scss';

class headerController {
  constructor(authService, $scope, $timeout) {
    this.authService = authService;
    this.$scope = $scope;
    this.$timeout = $timeout;

    this.authServiceKey = 'page-header';
    this.authService.addOnSignIn(this.authServiceKey, this.authChange.bind(this));
    this.authService.renderSignInButton('signInButton');

    this.authService.loadApi()
      .catch(() => {
        this.noGapi = true;
      });
  }

  $onDestroy() {
    this.authService.removeOnSignIn(this.authServiceKey);
  }

  applyScope() {
    this.$timeout(this.$scope.$apply(), 0);
  }

  authChange(isSignedIn) {
    this.authLoaded = true;
    this.loadAuth(isSignedIn);
    this.applyScope();
  }

  loadAuth(isSignedIn) {
    this.isSignedIn = isSignedIn;
    this.checkIsAdmin();
    if (!this.isSignedIn) {
      return;
    }
    const userInfo = this.authService.getUserInfo();
    this.userName = userInfo.getName();
    this.userImage = userInfo.getImageUrl();
    this.userEmail = userInfo.getEmail();
  }

  checkIsAdmin() {
    this.authService.checkIsAdmin().then((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  signout() {
    this.authService.signOut();
  }
}

headerController.$inject = ['AuthService', '$scope', '$timeout'];

angular.module('debugapp')
  .component('pageHeader', {
    template,
    controller: headerController,
    bindings: {},
  });
