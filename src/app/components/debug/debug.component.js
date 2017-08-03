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
    //console.log("entered: " +  + ", actual: " + );

    //for every line in bug_line string (is it a string? convert this?)
    //check if (!this.flags[lineNum])
    //if not true change a bool to false
    //break out of loop
    //go to incorrect modal

    //if safely traverse through bug_line
    //bool stays true
    //go to correct modal

    //old code
    /*
    if (this.errorLine == this.bug_line) {
      //correct lines
      //this.endTime = moment();
      this.correctLines = true;
      //timeTaken = this.endTime - this.startTime;
      var timeTaken = '11 seconds';
      var statistics = 'Time taken: ' + timeTaken + '; ' + 'Incorrect guesses: ' + this.incorrectGuesses.toString();
      
      this.$mdDialog.show({
        template: `<correct-line></correct-line>`,
        targetEvent: $event,
      });

      return;
    }
    */

    //incorrect lines
    this.incorrectGuesses += 1;
    this.$mdDialog.show(
      this.$mdDialog.alert()
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
