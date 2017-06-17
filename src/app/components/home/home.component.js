import angular from 'angular';
import findIndex from 'lodash/findIndex';
import drop from 'lodash/drop';
import forEach from 'lodash/forEach'
import template from './home.template.html';
import './home.scss';

class homeController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
    this.title = 'Hello World';
    this.fileLoaded = false;
    // Object for breakpoints => faster lookup than array.
    this.breakpoints = {};
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

  run() {
    // drop all lines before the currentIndex
    // search through all following lines for breakpoints that are set
    const newIndex = findIndex(
      drop(this.codeTrace, this.currentTraceIndex + 1), (trace => this.breakpoints[trace.line]));
    if (newIndex < 0) {
      this.goToEnd();
      return;
    }
    this.currentTraceIndex = newIndex + this.currentTraceIndex + 1;
  }

  toggleBreakpoint(lineNumber) {
    this.breakpoints[lineNumber] = !this.breakpoints[lineNumber];
  }

  memoryVarsToString() {
    // for each heap item not a function
    //    get it's name from the ordered global variables
    //    for each item in the heap
    //      get it's name and value
    //      concatenate to memoryString
    //    add separating ; to memoryString
    // add separating \n to memoryString

    var memoryString = "MEMORY\n";
    var heap = this.codeTrace[this.currentTraceIndex].heap;
    var globalVars = this.codeTrace[this.currentTraceIndex].ordered_globals;

    forEach(heap, (currentHeapObject => {
      forEach(currentHeapObject, (heapObjectItem => {
        if (heapObjectItem != null) {
          forEach(heapObjectItem, (item => {
            //omit first item?
            //i.e. 'Function', 'Dict'
            memoryString = memoryString + item.toString() + " ";
          }));
        }
        memoryString = memoryString + "\n";
      }));
    }));

    return memoryString;
  }
}

homeController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('home', {
    template,
    controller: homeController,
    bindings: {},
  });
