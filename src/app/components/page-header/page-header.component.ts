import * as angular from 'angular';
import { AuthService } from '../../services';

import './page-header.scss';
import template from './page-header.template.html';

class HeaderController {
  private authServiceKey: string;
  private authLoaded: boolean;
  private isSignedIn: boolean;
  private noGapi: boolean;

  private userName: string;
  private userImage: string;
  private userEmail: string;
  private isAdmin: boolean;

  constructor(private authService: AuthService, private $scope: angular.IScope, private $timeout: angular.ITimeoutService) {
    this.authServiceKey = 'page-header';
    this.authService.addOnSignIn(this.authServiceKey, this.authChange.bind(this));
    this.authService.renderSignInButton('signInButton');

    this.authService.loadApi()
      .catch(() => {
        this.noGapi = true;
      });
  }

  public $onDestroy() {
    this.authService.removeOnSignIn(this.authServiceKey);
  }

  public applyScope() {
    this.$timeout(this.$scope.$apply(), 0);
  }

  public authChange(isSignedIn: boolean) {
    this.authLoaded = true;
    this.loadAuth(isSignedIn);
    this.applyScope();
  }

  public async loadAuth(isSignedIn: boolean) {
    this.isSignedIn = isSignedIn;
    if (!this.isSignedIn) {
      return;
    }
    const userInfo = this.authService.getUserInfo();
    this.userName = userInfo.getName();
    this.userImage = userInfo.getImageUrl();
    this.userEmail = userInfo.getEmail();
    this.isAdmin = await this.authService.checkIsAdmin();
  }

  public signout() {
    this.authService.signOut();
  }
}

HeaderController.$inject = ['AuthService', '$scope', '$timeout'];

angular.module('debugapp')
  .component('pageHeader', {
    template,
    controller: HeaderController,
    bindings: {},
  });
