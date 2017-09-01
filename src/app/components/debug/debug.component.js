import angular from 'angular';
import drop from 'lodash/drop';
import every from 'lodash/every';
import some from 'lodash/some';
import includes from 'lodash/includes';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import parseInt from 'lodash/parseInt';
import split from 'lodash/split';
import moment from 'moment';
import TraceToCallStack from '../../helpers/trace-to-call-stack.helper';
import template from './debug.template.html';
import './debug.scss';

class debugController {
  constructor(exerciseService, authService, statsService, $mdDialog, $timeout, $state, $mdToast) {
    this.exerciseService = exerciseService;
    this.authService = authService;
    this.statsService = statsService;
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;
    this.$state = $state;
    this.$mdToast = $mdToast;

    this.selectedTabNum = 0;

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
    this.statistics.flagsSet = 0;
    this.startIdentifyTime = moment();
  }

  $onInit() {
    this.exerciseService.getOutputById(this.outputId)
      .then((response) => {
        this.codeString = response.debugInfo.code;
        this.codeTrace = response.debugInfo.trace;
        this.errorLines = response.errorLines;
        this.exerciseDescription = response.description;
        this.exerciseId = response.id;
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
      if (this.flags[lineNumber]) {
        this.statistics.flagsSet += 1;
      }
    }
  }

  openStackFrame(id) {
    if (this.visibleFrameId === id) {
      this.visibleFrameId = undefined;
    } else {
      this.visibleFrameId = id;
    }
  }

  displayHelp($event) {
    this.$mdDialog.show({
      template: '<help-display></help-display>',
      targetEvent: $event,
    });
  }

  checkFlags() {
    let flagSet;

    this.noFlagsSet = false;
    if (!some(this.flags)) {
      this.noFlagsSet = true;
    }

    // check that every flag has a corresponding errorLine
    const result = every(this.flags, (flagValue, lineNum) => {
      if (flagValue) {
        flagSet = true;
        return includes(this.errorLines, parseInt(lineNum));
      }
      return true;
    });

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

  toEditing() {
    if (!this.isEditing) {
      if (this.checkFlags()) {
        this.isEditing = true;
        this.selectedTabNum = 1;
        this.goToEnd();
      } else {
        this.selectedTabNum = 0;

        let errorMessage = 'Oops! One of your flagged lines doesn\'t contain an error, so you can\'t edit.';
        if (this.noFlagsSet) {
          errorMessage = 'Oops! You need to flag some buggy lines to edit.';
        }

        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent(errorMessage)
            .action('OK')
            .highlightAction(true)
            .highlightClass('md-accent')
            .hideDelay(10000)
        );
      }
    }
  }

  submit($event) {
    this.checkNewCode(true).then((isCodeValid) => {
      if (!isCodeValid) {
        this.shakeScreen();
        return;
      }

      this.completed = true;
      this.endTime = moment();
      this.statistics.startIdentifyTime = this.startIdentifyTime;
      this.statistics.startEditTime = this.startEditTime;
      this.statistics.endTime = this.endTime;
      this.statistics.totalTime =
        this.formatAsMinutes(this.endTime.diff(this.startIdentifyTime));

      this.saveStats();

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

  shakeScreen() {
    this.statistics.incorrectGuesses += 1;
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
        if (!response.error) {
          return true;
        }
        return false;
      });
  }

  saveStats() {
    // If the user is not logged in, the stats are saved anyway with userId of -1
    let userId = this.authService.getCurrentUserId();
    if (!userId) {
      userId = -1;
    }
    this.statsService.putNewStats(userId, this.statistics, this.exerciseId)
      .then(response => console.log(JSON.parse(response.inserted).$oid));
  }
}

debugController.$inject = ['ExerciseService', 'AuthService', 'StatsService',
  '$mdDialog', '$timeout', '$state', '$mdToast'];

angular.module('debugapp')
  .component('debug', {
    template,
    controller: debugController,
    bindings: {
      outputId: '@',
    },
  });
