import angular from 'angular';
import CodeMirror from 'codemirror';
import keys from 'lodash/keys';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';

/**
 * Binds a CodeMirror widget to a <textarea> element.
 * From https://github.com/angular-ui/ui-codemirror
 * Copied over and fixed up to work with Webpack v2 and es6
 */

function uiCodemirrorDirective(uiCodemirrorConfig, $timeout) {
  function newCodemirrorEditor(element, codemirrorOptions) {
    let codemirrorEditor;

    if (element[0].tagName === 'TEXTAREA') {
      // Might bug but still ...
      codemirrorEditor = CodeMirror.fromTextArea(element[0], codemirrorOptions);
    } else {
      element.html('');
      codemirrorEditor = new CodeMirror(((cmElement) => {
        element.append(cmElement);
      }), codemirrorOptions);
    }

    return codemirrorEditor;
  }

  function configOptionsWatcher(codemirrorEditor, uiCodemirrorAttr, $scope) {
    if (!uiCodemirrorAttr) { return; }

    const codemirrorDefaultsKeys = keys(CodeMirror.defaults);
    function updateOptions(newValues, oldValue) {
      if (!angular.isObject(newValues)) {
        return;
      }
      forEach(codemirrorDefaultsKeys, (key) => {
        if (includes(newValues, key)) {
          if (oldValue && newValues[key] === oldValue[key]) {
            return;
          }

          codemirrorEditor.setOption(key, newValues[key]);
        }
      });
    }
    $scope.$watch(uiCodemirrorAttr, updateOptions, true);
  }

  function configNgModelLink(codemirror, ngModel, $scope) {
    if (!ngModel) { return; }
    // CodeMirror expects a string, so make sure it gets one.
    // This does not change the model.
    ngModel.$formatters.push((value) => {
      if (angular.isUndefined(value) || value === null) {
        return '';
      } else if (angular.isObject(value) || angular.isArray(value)) {
        throw new Error('ui-codemirror cannot use an object or an array as a model');
      }
      return value;
    });


    // Override the ngModelController $render method
    // called when the model is updated.
    // Takes care of the synchronizing the CodeMirror element with the underlying model
    ngModel.$render = function () {
      // Ensure codmirror gets a string
      const safeViewValue = ngModel.$viewValue || '';
      codemirror.setValue(safeViewValue);
    };


    // Keep the ngModel in sync with changes from CodeMirror
    codemirror.on('change', (instance) => {
      const newValue = instance.getValue();
      if (newValue !== ngModel.$viewValue) {
        $scope.$evalAsync(() => {
          ngModel.$setViewValue(newValue);
        });
      }
    });
  }

  function configUiRefreshAttribute(codemirror, uiRefreshAttr, $scope) {
    if (!uiRefreshAttr) { return; }

    $scope.$watch(uiRefreshAttr, (newVal, oldVal) => {
      // Skip the initial watch firing
      if (newVal !== oldVal) {
        $timeout(() => {
          CodeMirror.refresh();
        });
      }
    });
  }

  function postLink($scope, element, attrs, ngModel) {
    const codemirrorOptions = angular.extend(
      { value: element.text() },
      uiCodemirrorConfig.codemirror || {},
      $scope.$eval(attrs.uiCodemirror),
      $scope.$eval(attrs.uiCodemirrorOpts),
    );

    const codemirrorEditor = newCodemirrorEditor(element, codemirrorOptions);

    configOptionsWatcher(
      codemirrorEditor,
      attrs.uiCodemirror || attrs.uiCodemirrorOpts,
      $scope,
    );

    configNgModelLink(codemirrorEditor, ngModel, $scope);

    configUiRefreshAttribute(codemirrorEditor, attrs.uiRefresh, $scope);

    // Allow access to the CodeMirror instance through a broadcasted event
    // eg: $broadcast('CodeMirror', function(cm){...});
    $scope.$on('CodeMirror', (event, callback) => {
      if (angular.isFunction(callback)) {
        callback(codemirrorEditor);
      } else {
        throw new Error('the CodeMirror event requires a callback function');
      }
    });

    // onLoad callback
    if (angular.isFunction(codemirrorOptions.onLoad)) {
      codemirrorOptions.onLoad(codemirrorEditor);
    }
  }

  return {
    restrict: 'EA',
    require: '?ngModel',
    compile: () => {
      // Require CodeMirror
      if (angular.isUndefined(CodeMirror)) {
        throw new Error('ui-codemirror needs CodeMirror to work... (o rly?)');
      }

      return postLink;
    },
  };
}

uiCodemirrorDirective.$inject = ['uiCodemirrorConfig', '$timeout'];

angular.module('ui.codemirror', [])
  .constant('uiCodemirrorConfig', {})
  .directive('uiCodemirror', uiCodemirrorDirective);
