import angular from 'angular';
import drop from 'lodash/drop';
import every from 'lodash/every';
import includes from 'lodash/includes';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import parseInt from 'lodash/parseInt';
import split from 'lodash/split';
import moment from 'moment';
import GuidHelper from '../../helpers/guid.helper';
import TraceToCallStack from '../../helpers/trace-to-call-stack.helper';
import template from './debug.template.html';
import './debug.scss';

class debugController {
  constructor(exerciseService, authService, statsService, scoresService,
    $mdDialog, $timeout, $state, $mdToast) {
    this.exerciseService = exerciseService;
    this.authService = authService;
    this.statsService = statsService;
    this.scoresService = scoresService;
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;
    this.$state = $state;
    this.$mdToast = $mdToast;

    this.selectedTabNum = 0;

    // Object for breakpoints and flags
    this.breakpoints = {};
    this.flags = {};
    // Variables for stats collection
    this.statistics = {
      incorrectGuesses: 0,
      run: 0,
      stepForward: 0,
      stepBack: 0,
      goToEnd: 0,
      goToStart: 0,
      breakpointsSet: 0,
      flagsSet: 0,
    };
    this.startTime = moment();
  }

  $onInit() {
    this.exerciseService.getOutputById(this.outputId)
      .then((response) => {
        this.codeString = response.debugInfo.code;
        this.codeTrace = response.debugInfo.trace;
        if (response.id) {
          this.existingExercise = true;
          this.pageName = response.name;
          this.errorLines = response.errorLines;
          this.exerciseDescription = response.description;
          this.exerciseId = response.id;
        }
        this.goToStart();
        this.outputLoaded = true;
      });
  }

  updateTraceIndex() {
    this.memory = TraceToCallStack.toStack(this.codeTrace[this.currentTraceIndex]);
    this.visibleFrameId = this.memory[this.memory.length - 1].id;
  }

  moveDebugger(newTraceIndex, buttonName) {
    this.currentTraceIndex = newTraceIndex;
    this.statistics[buttonName] += 1;
    this.updateTraceIndex();
  }

  goToStart() { this.moveDebugger(0, 'goToStart'); }
  stepBack() { this.moveDebugger(this.currentTraceIndex - 1, 'stepBack'); }
  stepForward() { this.moveDebugger(this.currentTraceIndex + 1, 'stepForward'); }
  goToEnd() { this.moveDebugger(this.codeTrace.length - 1, 'goToEnd'); }

  run() {
    // drop all lines before the currentIndex
    // search through all following lines for breakpoints that are set
    const newIndex = findIndex(
      drop(this.codeTrace, this.currentTraceIndex + 1), (trace => this.breakpoints[trace.line]));
    if (newIndex < 0) {
      this.goToEnd();
      return;
    }
    this.moveDebugger(newIndex + this.currentTraceIndex + 1, 'run');
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
      if (this.flags[lineNumber]) {
        this.statistics.flagsSet += 1;
      }
    }
  }

  openStackFrame(id) {
    this.visibleFrameId = (this.visibleFrameId === id) ? undefined : id;
  }

  displayHelp($event) {
    this.$mdDialog.show({
      template: '<help-display></help-display>',
      targetEvent: $event,
      clickOutsideToClose: true,
    });
  }

  checkFlags() {
    let flagSet;
    // check that every flag has a corresponding errorLine
    const result = every(this.flags, (flagValue, lineNum) => {
      if (flagValue) {
        flagSet = true;
        return includes(this.errorLines, parseInt(lineNum));
      }
      return true;
    });
    this.noFlagsSet = !flagSet;
    return result && flagSet;
  }

  formatAsMinutes(msDuration) {
    const duration = moment.utc(msDuration); // This breaks if the duration is longer than 24 hours
    return duration.format(duration.hours() ? 'h[h] m[m] ss[s]' : 'm[m] ss[s]');
  }

  toFlagging() {
    this.checkNewCode(false).then(() => {
      this.isEditing = false;
      this.selectedTabNum = 0;
      this.goToStart();
    });
  }

  showErrorToast(errorMessage) {
    if (this.showingToast) {
      return;
    }
    this.showingToast = true;
    this.$mdToast.show(
      this.$mdToast.simple()
        .textContent('Oops! ' + errorMessage)
        .action('OK')
        .highlightAction(true)
        .highlightClass('md-accent')
        .hideDelay(8000),
    ).then(() => { this.showingToast = false; });
  }

  toEditing() {
    if (this.isEditing) {
      return;
    }

    if (this.checkFlags()) {
      this.isEditing = true;
      this.selectedTabNum = 1;
      this.goToEnd();
      return;
    }

    this.selectedTabNum = 0;
    const errorMessage = (this.noFlagsSet) ?
      'You need to flag some buggy lines to edit.' :
      'One of your flagged lines doesn\'t contain an error, so you can\'t edit.';

    this.showErrorToast(errorMessage);
  }

  submit($event) {
    this.checkNewCode(true).then((isCodeValid) => {
      if (!isCodeValid) {
        this.incorrectSubmission();
        return;
      }

      this.completed = true;
      this.statistics.endTime = moment();
      this.statistics.startTime = this.startTime;
      this.statistics.timeTaken = this.formatAsMinutes(
        this.statistics.endTime.diff(this.startTime));

      // If the user is not logged in, the stats are saved anyway with userId of -1
      // but a score is not calculated
      this.authService.getCurrentUserId()
        .then((userId) => {
          if (userId !== -1) {
            this.calculateScore(userId);
          }
          this.statsService.putNewStats(userId, this.statistics, this.exerciseId);
        });

      const statsObj = this.statistics;
      this.$mdDialog.show({
        template: '<correct-line statistics="$ctrl.statistics"></correct-line>',
        targetEvent: $event,
        controller: [function () {
          this.statistics = statsObj;
        }],
        controllerAs: '$ctrl',
      })
        .then(() => this.$state.go('home'))
        .catch(() => this.$state.go('home'));
    });
  }

  incorrectSubmission() {
    this.statistics.incorrectGuesses += 1;
    this.shakeScreen();
    this.showErrorToast('There are still errors in the code.');
  }

  shakeScreen() {
    const page = document.getElementById('debugapp');
    page.classList.add('shake-constant');
    page.classList.add('shake-horizontal');

    this.$timeout(() => {
      page.classList.remove('shake-constant');
      page.classList.remove('shake-horizontal');
    }, 250);
  }

  checkNewCode(checking) {
    this.checkingCode = checking;
    const codeByLines = split(this.codeString, '\n');
    forEach(this.flags, (flagValue, flagLine) => {
      if (flagValue.updatedText) {
        const index = parseInt(flagLine) - 1;
        codeByLines[index] = flagValue.updatedText;
      }
    });
    const newCodeString = codeByLines.join('\n');
    return this.exerciseService.runSandbox(newCodeString)
      .then((response) => {
        this.codeString = response.debugInfo.code;
        this.codeTrace = response.debugInfo.trace;
        this.checkingCode = false;
        return (!response.error);
      });
  }

  calculateScore(userId) {
    const timeTakenMs = this.statistics.endTime.diff(this.startTime);
    const averageTimePerErrorMs = timeTakenMs / this.errorLines.length;

    // if score is too low for any stars, default one star on completion
    let numStars = 1;
    if (averageTimePerErrorMs <= 240000) { // 7 minutes
      numStars = 2;
    }
    if (averageTimePerErrorMs <= 180000) { // 5 minutes
      numStars = 3;
    }
    if (averageTimePerErrorMs <= 120000) { // 3 minutes
      numStars = 4;
    }
    if (averageTimePerErrorMs <= 60000) { // 1 minute
      numStars = 5;
    }

    const encodedUserId = GuidHelper.convertUserId(userId);
    this.scoresService.putScore(encodedUserId, this.exerciseId, numStars);
  }

  back() {
    // if user came from sandbox mode, they are returned to this page
    // with the code they wrote being displayed
    this.$state.go('sandboxwithcode', { outputID: this.outputId });
  }

  exit($event) {
    const textContent = `Your ${this.existingExercise ? 'score' : 'code'} will not be saved.`;
    this.$mdDialog.show(
      this.$mdDialog.confirm()
        .title('Are you sure you want to exit?')
        .textContent(textContent)
        .ariaLabel('Exit?')
        .targetEvent($event)
        .ok('Yes')
        .cancel('Cancel'),
    ).then(() => {
      this.$state.go('home');
    });
  }
}

debugController.$inject = ['ExerciseService', 'AuthService', 'StatsService', 'ScoresService',
  '$mdDialog', '$timeout', '$state', '$mdToast'];

angular.module('debugapp')
  .component('debug', {
    template,
    controller: debugController,
    bindings: {
      outputId: '@',
    },
  });
