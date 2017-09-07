import angular from 'angular';

import template from './page-header.template.html';
import './page-header.scss';

class headerController {
  constructor(authService, $scope) {
    this.authService = authService;
    this.$scope = $scope;

    if (window.gapi) {
      gapi.signin2.render('signInButton', {
        onSuccess: this.signIn.bind(this),
      });
    } else {
      this.noGapi = true;
    }
  }

  applyScope() {
    this.$scope.$apply();
  }

  signIn(googleUser) {
    const userInfo = this.authService.loadUser(googleUser);
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
