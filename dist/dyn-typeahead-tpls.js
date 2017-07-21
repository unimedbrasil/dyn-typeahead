angular.module('dyn.typeahead').run(['$templateCache', function($templateCache) {$templateCache.put('app/dyn-typeahead-template.html','<div class="input-group dyn-typeahead">\n    <input ng-disabled="dynTypeaheadCtrl.disabled || dynTypeaheadCtrl.loading" type="text" class="form-control"\n        ng-model="dynTypeaheadCtrl.ngModel" placeholder="{{dynTypeaheadCtrl.placeholder}}"\n        uib-typeahead="item[dynTypeaheadCtrl.key] as item[dynTypeaheadCtrl.value] for item in dynTypeaheadCtrl.filterValues($viewValue)"\n        typeahead-loading="dynTypeaheadCtrl.loading" typeahead-no-results="dynTypeaheadCtrl.noResults"\n        typeahead-show-hint="true" typeahead-min-length="0" focus-me="dynTypeaheadCtrl.focusTypeahead"\n        typeahead-input-formatter="dynTypeaheadCtrl.formatLabel($model)" typeahead-on-select="dynTypeaheadCtrl.onSelectValue($item, $model, $label)"/>\n\n    <div class="input-group-btn">\n        <button ng-if="!dynTypeaheadCtrl.loading && !dynTypeaheadCtrl.noResults && !dynTypeaheadCtrl.ngModel"\n                ng-click="dynTypeaheadCtrl.setFocus()"\n                ng-disabled="dynTypeaheadCtrl.disabled || dynTypeaheadCtrl.loading"\n                type="button"\n                class="btn btn-default">\n            <i class="fa fa-chevron-down"></i>\n        </button>\n        <button ng-if="dynTypeaheadCtrl.loading"\n                ng-disabled="dynTypeaheadCtrl.disabled || dynTypeaheadCtrl.loading"\n                type="button"\n                class="btn btn-default">\n            <i class="fa fa-refresh fa-spin"></i>\n        </button>\n        <button ng-if="dynTypeaheadCtrl.noResults"\n                ng-disabled="dynTypeaheadCtrl.disabled || dynTypeaheadCtrl.loading"\n                type="button"\n                class="btn btn-default">\n            <i class="fa fa-exclamation-triangle"></i>\n        </button>\n        <button ng-if="!dynTypeaheadCtrl.loading && !dynTypeaheadCtrl.noResults && dynTypeaheadCtrl.ngModel"\n                ng-click="dynTypeaheadCtrl.cleanTypeahead()"\n                ng-disabled="dynTypeaheadCtrl.disabled || dynTypeaheadCtrl.loading"\n                type="button"\n                class="btn btn-default">\n            <i class="fa fa-times"></i>\n        </button>\n    </div>\n</div>\n');}]);