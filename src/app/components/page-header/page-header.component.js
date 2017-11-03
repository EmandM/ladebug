import angular from 'angular';

import template from './page-header.template.html';
import './page-header.scss';

class headerController {
  constructor(authService, $scope, $timeout) {
    this.authService = authService;
    this.$scope = $scope;
    this.$timeout = $timeout;

    this.authService.checkSignedIn()
      .then((isSignedIn) => {
        this.loadAuth(isSignedIn);
        this.authLoaded = true;
      })
      .catch((error) => {
        console.log('error: ', error);
        this.noGapi = true;
      });
    this.authServiceKey = 'page-header';
    this.authService.addOnSignIn(this.authServiceKey, this.authChange.bind(this));
  }

  $onDestroy() {
    this.authService.removeOnSignIn(this.authServiceKey);
  }

  applyScope() {
    this.$timeout(this.$scope.$apply(), 0);
  }

  authChange(isSignedIn) {
    this.loadAuth(isSignedIn);
    this.applyScope();
  }

  loadAuth(isSignedIn) {
    this.isSignedIn = isSignedIn;
    if (!this.isSignedIn) {
      return;
    }
    const userInfo = this.authService.getUserInfo();
    this.userName = userInfo.getName();
    this.userImage = userInfo.getImageUrl();
    this.userEmail = userInfo.getEmail();
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
