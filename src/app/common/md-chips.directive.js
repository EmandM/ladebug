import angular from 'angular';
import parseInt from 'lodash/parseInt';

function mdChipsOverride() {
  return {
    restrict: 'E',
    require: 'mdChips', // Extends the original mdChips directive
    link: function (scope, element, attrs, mdChipsCtrl) {
      const chipsAsNumbers = (attrs.mdChipsAsNumbers !== undefined)
      mdChipsCtrl.onInputBlur = function () {
        this.inputHasFocus = false;

      // ADDED CODE
        var chipBuffer = this.getChipBuffer();
        if (chipBuffer != "") { // REQUIRED, OTHERWISE YOU'D GET A BLANK CHIP
            if (chipsAsNumbers) {
              chipBuffer = parseInt(chipBuffer);
            }
            this.appendChip(chipBuffer);
            this.resetChipBuffer();
        }
      // - EOF - ADDED CODE
      };
    }
  };
}

angular.module('debugapp').directive('mdChips', mdChipsOverride);
