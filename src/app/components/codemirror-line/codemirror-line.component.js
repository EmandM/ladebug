import angular from 'angular';
import isObject from 'lodash/isObject';

import template from './codemirror-line.template.html';
import './codemirror-line.scss';

class codemirrorLineController {
  constructor($timeout) {
    this.$timeout = $timeout;
    this.opts = {
      lineNumbers: false,
      lineWrapping: true,
      mode: 'python',
    };
  }

  codeMirrorLoaded(editor) {
    this.editor = editor;
    this.editor.on('beforeChange', (cm, changeObj) => {
      const typedNewLine = changeObj.origin === '+input' && isObject(changeObj.text) && changeObj.text.join('') === '';
      if (typedNewLine) {
        return changeObj.cancel();
      }

      const pastedNewLine = changeObj.origin === 'paste' && isObject(changeObj.text) && changeObj.text.length > 1;
      if (pastedNewLine) {
        const newText = changeObj.text.join(' ');
        return changeObj.update(null, null, [newText]);
      }

      return null;
    });
    this.editor.on('change', () => {
      // Fire the ng-change function after the change has resolved.
      this.$timeout(() => this.ngChange(), 0);
    });
  }

}

codemirrorLineController.$inject = ['$timeout'];

angular.module('debugapp')
  .component('codemirrorLine', {
    template,
    controller: codemirrorLineController,
    bindings: {
      ngModel: '=',
      ngChange: '&',
    },
  });
