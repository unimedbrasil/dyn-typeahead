(function() {
    'use strict';

    angular
        .module('dyn.typeahead')
        .directive('dynTypeahead', dynTypeahead);

    dynTypeahead.$inject = [];

    /* @ngInject */
    function dynTypeahead() {
        return {
            restrict: 'E',
            templateUrl: 'app/dyn-typeahead-template.html',
            controller: DynTypeaheadController,
            controllerAs: 'dynTypeaheadCtrl',
            require: 'ngModel',
            scope: {
                domain: '@',
                url: '@',
                localElements: '=',
                key: '@',
                value: '@',
                ngModel: '=',
                placeholder: '@',
                onSelect: '&',
                disabled: '=?ngDisabled'
            },
            link: function(scope, element, attr, modelCtrl) {
                modelCtrl.$formatters.push(function(value) {
                    var isValid = !value || Number.isInteger(value);
                    modelCtrl.$setValidity('isNaN', isValid);
                });
            },
            bindToController: true,
            replace: false
        };
    }

    DynTypeaheadController.$inject = ['$http', '$timeout', 'dynDomainsService', '$scope'];

    /**
     * Controller para a diretiva, especialmente para capturar o modo de consulta definido e carregar os valores.
     *
     * @param {Object} $http             Serviço de requisição HTTP.
     * @param {Object} dynDomainsService Serviço para consulta de dominios.
     */
    function DynTypeaheadController($http, $timeout, dynDomainsService, $scope) {

        var _this = this;

        // Value cache
        _this.values = [];

        // Variaveis de controle do Typeahead
        _this.loading = false;
        _this.noResults = false;
        _this.focusTypeahead = false;
        _this.preInitValue = null;
        _this.disabled = _this.disabled || false;

        _this.onSelectValue = onSelectValue;
        _this.formatLabel = formatLabel;
        _this.setFocus = setFocus;
        _this.cleanTypeahead = cleanTypeahead;
        _this.filterValues = filterValues;

        // Nome dos atributos do objeto, pode ser alterado pelo usuario.
        _this.key = _this.key || 'key';
        _this.value = _this.value || 'value';

        _init();

        // Construtor
        function _init() {
            _initWatchers();
            fetchValues();
        }

        /**
         *
         * @return {[type]} [description]
         */
        function _initWatchers() {
            // watch para localElements
            $scope.$watch(function() {
                return _this.localElements;
            }, function() {
                fetchValues(true);
            });

            // watch para o model
            $scope.$watch(function() {
                return _this.ngModel;
            }, readModel);
        }

        /**
         * Busca todos os valores e adicionar ao cache local.
         * @return {Object} Promise da requisição.
         */
        function fetchValues(reload) {
            if (_this.values.length > 0 && !reload) {
                return _this.values;
            } else {
                _this.loading = true;
                if (_this.domain) {
                    fetchFromDomain().then(updateLocalDataAsync);
                } else if (_this.url) {
                    fetchFromUrl().then(updateLocalDataAsync);
                } else if (_this.localElements) {
                    updateLocalData(angular.copy(_this.localElements));
                } else {
                    throw new Error('Um valor para domain, url ou localElements deve ser especificado.');
                }
            }

            /**
             * Realiza a atualização dos dados locais
             *
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            function updateLocalData(data) {
                _this.values = data;
                _this.loading = false;
                readModel();
            }

            /**
             * Realiza a atualização dos dados locais para consultas assincronas.
             *
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            function updateLocalDataAsync(data) {
                var model = _this.ngModel;

                // o evento typeahead-input-formatter do typeahead do ui-bootstrap
                // é lançado somente ao alterar o ngModel, fazendo necessária a tratativa
                $timeout(function () {
                    _this.ngModel = null;
                    $timeout(function () {
                        _this.ngModel = model;
                        updateLocalData(data);
                    }, 0);
                }, 0);
            }
        }

        /**
         * Filtra os valores.
         * @param  {String} val   Termo pesquisado.
         * @return {Object}       Objeto contendo o termo pesquisado.
         */
        function filterValues(val) {
            var result = _this.values.filter(function(item) {
                if (val) {
                    var itemKey = (item[_this.key] + '').toLowerCase();
                    var itemValue = (item[_this.value] + '').toLowerCase();
                    var userVal = val.toLowerCase();
                    return itemKey.indexOf(userVal) >= 0 || itemValue.indexOf(userVal) >= 0;
                }
                return true;
            });
            return result;
        }

        /**
         * Consulta os dados do serviço de dominios.
         */
         function fetchFromDomain() {
            return dynDomainsService.getDomain(_this.domain)
                .then(function(data) {
                    return data;
                });
        }

        /**
         * Consulta os dados de uma URL especifica.
         */
        function fetchFromUrl() {
            return $http.get(_this.url)
                .then(function(response) {
                    return response.data;
                });
        }

        /**
         * Limpa o typeahead.
         */
        function cleanTypeahead() {
            if (!_this.loading) {
                _this.noResults = false;
                _this.ngModel = '';
                _this.onSelectValue(null, null, null);
            }
        }

        /**
         * Seta foco no typeahead fazendo a lista abrir.
         */
        function setFocus() {
            if (!_this.loading) {
                _this.focusTypeahead = true;
            }
        }

        /**
         * Formata o que vai ser exibido no elemento.
         * A key do objeto vai para o model e o value para a tela.
         * @param  {Object} value Valor selecionado.
         * @return {String}       Descrição a ser exibida na tela.
         */
        function formatLabel(value) {
            for (var i = 0; i < _this.values.length; i++) {
                var item = _this.values[i];
                if (String(value) === String(item[_this.key])) {
                    return String(item[_this.value]);
                }
            }
            return value;
        }

        /**
         * Callback para pegar o item selecionado no componente.
         * @param  {Object} $item  Objecto que representa o item selecionado.
         * @param  {Object} $model Key do model.
         * @param  {Object} $label Value do model.
         */
        function onSelectValue($item, $model, $label) {
            if (_this.onSelect) {
                var expression = _this.onSelect();
                if (typeof expression === 'function') {
                    expression($item);
                }
            }
        }

        /**
         * Realiza a leitura do model e define a seleção dentro da listagem
         * @return {[type]} [description]
         */
        function readModel() {
            if (_this.ngModel === null || _this.ngModel === undefined) {
                return;
            }
            var item = getItemByKey(_this.values, _this.ngModel);
            if (!item) {
                return _this.ngModel;
            }
            _this.onSelectValue(item, item[_this.key], item[_this.value]);
        }

        /**
         * Retorna o item para determinada key.
         * @param  {Object} key Key do objeto.
         * @return {Object}     Objeto contendo a key.
         */
        function getItemByKey(values, key) {
            for (var i = 0; i < values.length; i++) {
                var item = values[i];
                if (key === item[_this.key]) {
                    return item;
                }
            }
        }
    }
})();
