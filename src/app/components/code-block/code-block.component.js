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
    if (changesObj.codeString) {
      // Split the code by newline characters to have reference to each line.
      this.codeByLines = split(this.codeString, '\n');
      this.calculateCommentBlockLines();
    }
  }

  // Function to find comment blocks and save their line numbers
  calculateCommentBlockLines() {
    let inCommentBlock = false;
    // Triple quotes are a marker for comment blocks in python
    const commentBlockMarker = '\'\'\'';
    this.commentAndEmptyLines = {};
    this.blockComments = {};
    forEach(this.codeByLines, (currentLine, lineIndex) => {
      if (inCommentBlock) {
        this.commentAndEmptyLines[lineIndex] = true;
        this.blockComments[lineIndex] = true;
        return;
      }
      const trimmedLine = trim(currentLine);
      if (!trimmedLine || startsWith(trimmedLine, '#')) {
        this.commentAndEmptyLines[lineIndex] = true;
        return;
      }
      if (trimmedLine === commentBlockMarker) {
        if (!inCommentBlock) {
          this.commentAndEmptyLines[lineIndex] = true;
          this.blockComments[lineIndex] = true;
        }
        inCommentBlock = !inCommentBlock;
      }
    });
  }

  isWhitespaceOrComment(lineNum) {
    return this.commentAndEmptyLines[lineNum - 1];
  }

  toggleIcon(lineNum, iconType) {
    if (this.isEditing) {
      return;
    }

    if (iconType === 'breakpoint') {
      // if line is empty or is a comment, try put a breakpoint on the next line
      if (this.isWhitespaceOrComment(lineNum)) {
        this.toggleIcon(lineNum + 1, iconType);
        return;
      }
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
