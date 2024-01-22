import angular from 'angular';
import split from 'lodash/split';
import trim from 'lodash/trim';
import startsWith from 'lodash/startsWith';
import forEach from 'lodash/forEach';

import template from './code-block.template.html';
import './code-block.scss';

class codeBlockController {
  // constructor() {
  // }

  $onChanges(changesObj) {
    if (changesObj.codeString && changesObj.codeString.currentValue) {
      // Split the code by newline characters to have reference to each line.
      this.codeByLines = split(changesObj.codeString.currentValue, '\n');
      this.calculateCommentBlockLines();
    }
  }

  // Function to find comment blocks and save their line numbers
  calculateCommentBlockLines() {
    let inSingleCommentBlock = false;
    let inDoubleCommentBlock = false;
    // Triple quotes are a marker for comment blocks in python
    const singleCommentBlockMarker = '\'\'\'';
    const doubleCommentBlockMarker = '"""';
    this.commentAndEmptyLines = {};
    this.blockComments = {};
    forEach(this.codeByLines, (currentLine, lineIndex) => {
      const trimmedLine = trim(currentLine);

      if (trimmedLine === singleCommentBlockMarker && !inDoubleCommentBlock) {
        inSingleCommentBlock = !inSingleCommentBlock;
      }
      if (trimmedLine === doubleCommentBlockMarker && !inSingleCommentBlock) {
        inDoubleCommentBlock = !inDoubleCommentBlock;
      }
      if (inSingleCommentBlock || inDoubleCommentBlock) {
        this.commentAndEmptyLines[lineIndex] = true;
        this.blockComments[lineIndex] = true;
        return;
      }

      if (!trimmedLine || startsWith(trimmedLine, '#')) {
        this.commentAndEmptyLines[lineIndex] = true;
      }
    });
  }

  isWhitespaceOrComment(lineNum) {
    return this.commentAndEmptyLines[lineNum - 1];
  }

  // onlyTurnOn indicates to turn a breakpoint on not off.
  toggleIcon(lineNum, iconType, onlyTurnOn) {
    if (this.isEditing) {
      return;
    }

    if (iconType === 'breakpoint') {
      // if line is empty or is a comment, try put a breakpoint on the next line
      if (this.isWhitespaceOrComment(lineNum)) {
        this.toggleIcon(lineNum + 1, iconType, true);
        return;
      }
    }

    // Don't trigger iconAction if onlyTurnOn is true and the icon is already true.
    if (onlyTurnOn && this[iconType + 's'][lineNum]) {
      return;
    }

    this.iconAction({ line: lineNum, icon: iconType });
  }

  // Determine whether lineNum is current line of execution
  isCurrentLine(lineNum) {
    if (this.isEditing) {
      return false;
    }
    return this.currentLine === lineNum;
  }

  lineChanged(lineNum, newText) {
    this.flags[lineNum] = { updatedText: newText };
  }
}

codeBlockController.$inject = [];

angular.module('debugapp')
  .component('codeBlock', {
    template,
    controller: codeBlockController,
    bindings: {
      codeString: '<', // String representation of executed code
      currentLine: '<', // current execution line
      breakpoints: '<', // Array of breakpoints
      flags: '<', // Array of flags
      iconAction: '&', // callback to toggle breakpoints and flags
      isEditing: '<',
      existingExercise: '<',
    },
  });
