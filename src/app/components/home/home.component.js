import angular from 'angular';
import remove from 'lodash/remove';
import template from './home.template.html';
import './home.scss';

class homeController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
    this.title = 'Hello World';
    this.fileLoaded = false;
    this.breakpoints = [];
    this.launchFilePicker(false);
  }

  launchFilePicker(canClose, $event) {
    this.$mdDialog.show({
      template: `<choose-file can-close="${canClose}"></choose-file>`,
      targetEvent: $event,
      clickOutsideToClose: canClose,
      escapeToClose: canClose,
    }).then((fileContents) => {
      this.fileLoaded = true;
      this.codeString = fileContents.code;
      this.codeTrace = fileContents.trace;
      this.goToStart();
    });
  }

  goToStart() { this.currentTraceIndex = 0; }
  stepBack() { this.currentTraceIndex -= 1; }
  stepForward() { this.currentTraceIndex += 1; }
  goToEnd() { this.currentTraceIndex = this.codeTrace.length - 1; }

  toggleBreakpoint(lineNumber) {
    if (lineNumber in this.breakpoints) {
      remove(this.breakpoints, (breakpoint => lineNumber === breakpoint));
    } else {
      this.breakpoints.push(lineNumber);
    }
  }
}

homeController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('home', {
    template,
    controller: homeController,
    bindings: {},
  });
