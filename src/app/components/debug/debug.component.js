import angular from 'angular';
import drop from 'lodash/drop';
import every from 'lodash/every';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import parseInt from 'lodash/parseInt';
import split from 'lodash/split';
import moment from 'moment';
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
      incorrectFlags: 0,
      correctFlags: 0,
    };
    this.startTime = moment();
  }

  $onInit() {
    this.exerciseService.getOutputById(this.outputId)
      .then((response) => {
        this.codeString = response.debugInfo.code;
        this.codeTrace = response.debugInfo.trace;
        if (response.name) {
          this.existingExercise = true;
          this.pageName = response.name;
          this.errorLines = response.errorLines;
          this.exerciseDescription = response.description;
          this.tests = response.testCases;
          this.funcName = response.entry_function;
        }
        this.goToStart();
        this.outputLoaded = true;
      });
  }

  $onDestroy() {
    this.$mdToast.hide();
  }

  moveDebugger(newTraceIndex, buttonName) {
    this.currentTrace = this.codeTrace[newTraceIndex];
    this.currentTest = this.currentTrace.current_test;
    this.currentTraceIndex = newTraceIndex;

    this.statistics[buttonName] += 1;
    this.memory = TraceToCallStack.toStack(this.currentTrace);
    this.visibleFrameId = this.memory[this.memory.length - 1].id;
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
        const flagType = includes(this.errorLines, lineNumber) ? 'correct' : 'incorrect';
        this.statistics[flagType + 'Flags'] += 1;
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
      const timeTakenMs = this.statistics.endTime.diff(this.startTime);
      this.statistics.timeTaken = timeTakenMs;

      const stars = this.scoresService.calculateStars(timeTakenMs,
        this.errorLines.length, this.statistics.incorrectFlags, this.statistics.incorrectGuesses);
      const onDialogClose = () => {
        this.outputLoaded = false;
        this.saveScore(stars)
          .then(() => {
            this.$state.go('home');
          });
      };

      this.$mdDialog.show({
        template: `<md-dialog flex="40" flex-gt-md="30"><complete-exercise complete-time="${timeTakenMs}" score="${stars}"></complete-exercise></md-dialog>`,
        clickOutsideToClose: true,
        targetEvent: $event,
      }).then(onDialogClose.bind(this))
        .catch(onDialogClose.bind(this));
    });
  }

  saveScore(stars) {
    // If the user is not logged in, the stats are saved anyway with userId of -1
    // but a score is not saved
    return this.authService.getCurrentUserId()
      .then((userId) => {
        this.statistics.email = this.authService.getUserEmail();
        this.statsService.putNewStats(userId, this.statistics, this.outputId);
        if (userId !== -1) {
          return this.scoresService.updateScore(userId, this.outputId, stars);
        }
        return false;
      });
  }

  incorrectSubmission() {
    this.statistics.incorrectGuesses += 1;
    this.shakeScreen();
    this.showErrorToast('There are still errors in the code.');
    this.goToEnd();
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
      // if user updated text, then replace existing text with new
      if (flagValue.updatedText) {
        const index = parseInt(flagLine) - 1;
        codeByLines[index] = flagValue.updatedText;
      }
    });
    const newCodeString = codeByLines.join('\n');
    return this.exerciseService.runSandbox(newCodeString, this.funcName, this.tests)
      .then((response) => {
        this.codeString = response.debugInfo.code;
        this.codeTrace = response.debugInfo.trace;
        this.checkingCode = false;
        return (!response.error);
      });
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
