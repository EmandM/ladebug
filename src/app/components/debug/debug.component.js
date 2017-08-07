import angular from 'angular';
import findIndex from 'lodash/findIndex';
import drop from 'lodash/drop';
//import moment;
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
    this.statistics = {};
    this.statistics['incorrectGuesses'] = 0;
    this.statistics['run'] = 0;
    this.statistics['stepForward'] = 0;
    this.statistics['stepBack'] = 0;
    this.statistics['goToEnd'] = 0;
    this.statistics['goToStart'] = 0;
    this.statistics['breakpointsSet'] = 0;
    this.statistics['timeToCorrectlyGuessErrorLines'] = 0;
    this.statistics['timeToCorrectlyEditErrorLines'] = 0;
    //this.startTime = moment(startTimeStampInMS).format("L LT");
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
    this.statistics.goToStart += 1; 
  }
  stepBack() {
    this.currentTraceIndex -= 1;
    this.updateTraceIndex();
    this.statistics.stepBack += 1;
  }
  stepForward() {
    this.currentTraceIndex += 1;
    this.updateTraceIndex();
    this.statistics.stepForward += 1;
  }
  goToEnd() {
    this.currentTraceIndex = this.codeTrace.length - 1;
    this.updateTraceIndex();
    this.statistics.goToEnd += 1;
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
    this.statistics.run += 1;
  }

  toggleIcon(lineNumber, iconType) {
    if (iconType === 'breakpoint') {
      this.breakpoints[lineNumber] = !this.breakpoints[lineNumber];
      this.statistics.breakpointsSet += 1;
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

  checkFlags() {
    //no lines flagged
    var flagsLength = Object.keys(this.flags).length;
    if (flagsLength < 1) {
      //this.incorrectGuess($event); TODO show incorrect modal? or button click does nothing?
      return false;
    }
    
    //check that all flagged lines are in error lines array
    for (var flagLine in this.flags) {
      if (this.flags[flagLine]) {
        if (this.errorLines.indexOf(flagLine) == -1) {
          return false;
        }
      }
    }
    //check that all error lines are in flagged lines array
    //i.e. check for any non flagged error lines
    for (var i = 0; i < this.errorLines.length; i++) {
      if (!(this.errorLines[i] in this.flags)) {
        return false;
      }
    }

    return true;
  }

  incorrectGuess($event) {
    this.statistics.incorrectGuesses += 1;
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

  submit($event) {
    var allCorrect = this.checkFlags();

    if (allCorrect) {
      /* MOMENT
      this.endTime = moment(endTimeStampInMS).format("L LT");
      var differenceMs = this.endTime.diff(this.startTime);
      var duration = moment.duration(differenceMs);
      console.log("duration = " + duration);
      */

      const statisticsPass = this.statistics;
      this.$mdDialog.show({
        template: `<correct-line statistics="$ctrl.statistics"></correct-line>`,
        targetEvent: $event,
        controller: [function () {
          this.statistics = statisticsPass;
        }],
        controllerAs: '$ctrl',
      });

      return;
    }

    this.incorrectGuess($event);
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
