import angular from 'angular';
import findIndex from 'lodash/findIndex';
import drop from 'lodash/drop';
import every from 'lodash/every';
import reduce from 'lodash/reduce';
import moment from 'moment';
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
    this.statistics.incorrectGuesses = 0;
    this.statistics.run = 0;
    this.statistics.stepForward = 0;
    this.statistics.stepBack = 0;
    this.statistics.goToEnd = 0;
    this.statistics.goToStart = 0;
    this.statistics.breakpointsSet = 0;
    this.statistics.timeToCorrectlyGuessErrorLines = 0;
    this.statistics.timeToCorrectlyEditErrorLines = 0;
    this.startTime = moment();
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
      if (this.breakpoints[lineNumber]) {
        this.statistics.breakpointsSet += 1;
      }
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
    // Count the number of flags that are currently active (see lodash reduce)
    const numFlags = reduce(this.flags, (sum, value) => (sum + (value) ? 1 : 0), 0);

    // same number of flags as there are errors
    if (numFlags.length !== this.errorLines.length) {
      return false;
    }
    // check that every error has a corresponding flag
    return every(this.errorLines, (lineNum => this.flags[lineNum]));
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
        .targetEvent($event),
    );
  }

  formatAsMinutes(msDuration) {
    const duration = moment.utc(msDuration); // This breaks if the duration is longer than 24 hours
    return duration.format(duration.hours() ? 'h:mm:ss' : 'm:ss');
  }

  submit($event) {
    if (!this.checkFlags()) {
      this.incorrectGuess($event);
      return;
    }

    /* MOMENT */
    const endTime = moment();
    this.statistics.timeTaken = this.formatAsMinutes(endTime.diff(this.startTime));

    const statsObj = this.statistics;
    this.$mdDialog.show({
      template: '<correct-line statistics="$ctrl.statistics"></correct-line>',
      targetEvent: $event,
      controller: [function () {
        this.statistics = statsObj;
      }],
      controllerAs: '$ctrl',
    });
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
