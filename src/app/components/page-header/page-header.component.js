import angular from 'angular';

import template from './page-header.template.html';
import './page-header.scss';

class headerController {
  constructor(authService, $scope) {
    this.authService = authService;
    this.$scope = $scope;

    this.authService.loadApi()
      .catch(() => {
        this.noGapi = true;
      });
    this.authServiceKey = 'page-header';
    this.authService.addOnSignIn(this.authServiceKey, this.authChange.bind(this));
    this.authService.renderSignInButton('signInButton');
  }
  $onDestroy() {
    this.authService.removeOnSignIn(this.authServiceKey);
  }

  applyScope() {
    this.$scope.$apply();
  }

  authChange(isSignedIn) {
    if (!isSignedIn) {
      return;
    }
    const userInfo = this.authService.getUserInfo();
    this.userName = userInfo.getName();
    this.userImage = userInfo.getImageUrl();
    this.userEmail = userInfo.getEmail();
    this.userLoaded = true;
    this.applyScope();
  }

  signout() {
    this.authService.signOut()
      .then(() => {
        this.userLoaded = false;
        this.applyScope();
      });
  }
}

headerController.$inject = ['AuthService', '$scope'];

angular.module('debugapp')
  .component('pageHeader', {
    template,
    controller: headerController,
    bindings: {},
  });
