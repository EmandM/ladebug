import angular from 'angular';
import findIndex from 'lodash/findIndex';
import drop from 'lodash/drop';
//import moment from 
import TraceToCallStack from '../../helpers/trace-to-call-stack.helper';
import template from './debug.template.html';
import './debug.scss';

class debugController {
  constructor(exerciseService, $mdDialog) {
    this.exerciseService = exerciseService;
    this.$mdDialog = $mdDialog;

    // Object for breakpoints => faster lookup than array.
    this.breakpoints = {};
    //this.startTime = moment();
    this.incorrectGuesses = 0;
  }

  $onInit() {
    this.exerciseService.getOutputById(this.outputId)
      .then((response) => {
        this.codeString = response.debugInfo.code;
        this.codeTrace = response.debugInfo.trace;
        this.bug_line = response.bug_line;
        if (response.name) {
          this.existingExercise = true;
          this.pageName = response.name;
        }
        this.goToStart();
        this.outputLoaded = true;
      });
  }

  updateTraceIndex() {
    this.memory = TraceToCallStack.toStack(this.codeTrace[this.currentTraceIndex]);
    this.visibleFrameId = this.memory[this.memory.length - 1].id;
  }

  goToStart() {
    this.currentTraceIndex = 0;
    this.updateTraceIndex();
  }
  stepBack() {
    this.currentTraceIndex -= 1;
    this.updateTraceIndex();
  }
  stepForward() {
    this.currentTraceIndex += 1;
    this.updateTraceIndex();
  }
  goToEnd() {
    this.currentTraceIndex = this.codeTrace.length - 1;
    this.updateTraceIndex();
  }

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
    this.updateTraceIndex();
  }

  toggleBreakpoint(lineNumber) {
    this.breakpoints[lineNumber] = !this.breakpoints[lineNumber];
  }

  openStackFrame(id) {
    if (this.visibleFrameId === id) {
      this.visibleFrameId = undefined;
    } else {
      this.visibleFrameId = id;
    }
  }

  submit($event) {
    if(!this.errorLine) {
      return;
    }
    if (!this.errorLineForm.$valid) {
      return;
    }

    //this.endTime = moment();
    console.log("entered: " + this.errorLine + ", actual: " + this.bug_line);

    if(this.errorLine == this.bug_line) {
      this.submitted = true;
      //timeTaken = this.endTime - this.startTime;
      var timeTaken = '11 seconds';
      var statistics = 'Time taken: ' + timeTaken + '; ' + 'Incorrect guesses: ' + this.incorrectGuesses.toString();
      //correct line modal
      this.$mdDialog.show(
      this.$mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Good Work!')
        .textContent('You entered the correct line, ' + this.errorLine + '! ' + statistics)
        .ariaLabel('Correct Line Alert Dialog')
        .ok('OK')
        .targetEvent($event)
      );
      
      return;
    }

    this.incorrectGuesses += 1;
    //incorrect line modal
    this.$mdDialog.show(
      this.$mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Incorrect Line')
        .textContent('Please try again.')
        .ariaLabel('Incorrect Line Alert Dialog')
        .ok('OK')
        .targetEvent($event)
    );
  }
}

debugController.$inject = ['ExerciseService', '$mdDialog'];

angular.module('debugapp')
  .component('debug', {
    template,
    controller: debugController,
    bindings: {
      outputId: '@',
    },
  });
