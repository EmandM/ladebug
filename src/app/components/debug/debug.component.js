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

    // Object for breakpoints and flags => faster lookup than array.
    this.breakpoints = {};
    this.flags = {};

    // Variables for stats collection
    //this.startTime = moment();
    this.incorrectGuesses = 0;
  }

  $onInit() {
    this.exerciseService.getOutputById(this.outputId)
      .then((response) => {
        this.codeString = response.debugInfo.code;
        this.codeTrace = response.debugInfo.trace;
        this.errorLines = response.errorLines;
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

  toggleIcon(lineNumber, iconType) {
    if (iconType === 'breakpoint') {
      this.breakpoints[lineNumber] = !this.breakpoints[lineNumber];
    }
    if (iconType === 'flag') {
      this.flags[lineNumber] = !this.flags[lineNumber];
    }
  }

  openStackFrame(id) {
    if (this.visibleFrameId === id) {
      this.visibleFrameId = undefined;
    } else {
      this.visibleFrameId = id;
    }
  }

  submit($event) {
    var allCorrect = true;

    //no lines flagged
    var flagsLength = Object.keys(this.flags).length;
    if (flagsLength < 1) {
      //this.incorrectGuess($event); TODO show incorrect modal? or button click does nothing?
      return;
    }
    
    //check that all flagged lines are in error lines array
    for (var flagLine in this.flags) {
      if (this.errorLines.indexOf(flagLine) == -1) {
        allCorrect = false;
      }
    }
    //check that all error lines are in flagged lines array
    //i.e. check for any non flagged error lines
    if (allCorrect) {
      for (var i = 0; i < this.errorLines.length; i++) {
        if (!(this.errorLines[i] in this.flags)) {
          allCorrect = false;
        }
      }
    }

    if (allCorrect) {
      //this.endTime = moment();
      
      this.$mdDialog.show({
        template: `<correct-line></correct-line>`,
        targetEvent: $event,
      });

      return;
    }

    this.incorrectGuess($event);
  }

  incorrectGuess($event) {
    this.incorrectGuesses += 1;
    this.$mdDialog.show(
      this.$mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Incorrect')
        .textContent('Please try again.')
        .ariaLabel('Incorrect Alert Dialog')
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
