import angular from 'angular';
import findIndex from 'lodash/findIndex';
import drop from 'lodash/drop';
import TraceToCallStack from '../../helpers/trace-to-call-stack.helper';
import template from './debug.template.html';
import './debug.scss';

class debugController {
  constructor(conversionService) {
    this.conversionService = conversionService;

    // Object for breakpoints => faster lookup than array.
    this.breakpoints = {};
  }

  $onInit() {
    this.conversionService.getOutputById(this.outputId)
      .then((response) => {
        this.codeString = response.code;
        this.codeTrace = response.trace;
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
}

debugController.$inject = ['ConversionService'];

angular.module('debugapp')
  .component('debug', {
    template,
    controller: debugController,
    bindings: {
      outputId: '@',
    },
  });
