import angular from 'angular';
import parseInt from 'lodash/parseInt';

function mdChipsOverride() {
  return {
    restrict: 'E',
    require: 'mdChips', // Extends the original mdChips directive
    link(scope, element, attrs, mdChipsCtrl) {
      const chipsAsNumbers = (attrs.mdChipsAsNumbers !== undefined);
      mdChipsCtrl.originalAppendChip = mdChipsCtrl.appendChip;

      mdChipsCtrl.appendChip = function (chipBuffer) {
        if (chipsAsNumbers) {
          chipBuffer = parseInt(chipBuffer);
        }
        this.originalAppendChip(chipBuffer);
      };

      mdChipsCtrl.onInputBlur = function () {
        this.inputHasFocus = false;

        // ADDED CODE
        const chipBuffer = this.getChipBuffer();
        if (chipBuffer !== '') { // REQUIRED, OTHERWISE YOU'D GET A BLANK CHIP
          this.appendChip(chipBuffer);
          this.resetChipBuffer();
        }
      // - EOF - ADDED CODE
      };
    },
  };
}

angular.module('debugapp').directive('mdChips', mdChipsOverride);
